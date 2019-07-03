import { Action } from '../../services/abilities/ability.constants'
import { Subject, OpportunityRoutes } from './opportunity.constants'
import Opportunity from './opportunity'
import pick from 'lodash.pick'

const convertRequestToAction = (req) => {
  console.log(req.method)
  console.log(req.route.path)
  switch (req.method) {
    case 'GET':
      return req.route.path === OpportunityRoutes[Action.READ] ? Action.READ : Action.LIST
    case 'POST':
      return req.route.path === OpportunityRoutes[Action.CREATE] ? Action.CREATE : Action.UPDATE
    default:
      return Action.READ
  }
}

const authorizeOpportunityActions = (req, res, next) => {
  console.log('authorizeOpportunityActions')
  const action = convertRequestToAction(req)
  const authorized = req.ability.can(action, Subject)
  if (authorized) {
    next()
  } else {
    res.status(403).end()
  }
}

const authorizeOpportunityFields = (req, res, next) => {
  var authorizedFields = Opportunity.accessibleFieldsBy(req.ability)
  res.data = Array.isArray(res.body)
    ? res.body.map(opp => pick(opp, authorizedFields))
    : pick(res.body, authorizedFields)
  next()
}

module.exports = {
  authorizeOpportunityActions,
  authorizeOpportunityFields
}
