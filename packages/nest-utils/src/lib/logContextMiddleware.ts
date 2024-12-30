import { CorrelationIdPropagator } from '@f1-challenger/correlation-id-propagator'
import { v4 as uuid } from 'uuid'
import { NestFunctionalMiddleware } from './NestFunctionalMiddleware'

export const logContextMiddleware: NestFunctionalMiddleware = (_request, _response, next) => {
  CorrelationIdPropagator.runWithContext(
    // TODO: when implementing propagation across services, get the correlationId from the header if it exists, else create a new UUID
    uuid(),
    next
  )
}
