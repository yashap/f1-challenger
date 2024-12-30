import { ContextPropagator } from '@f1-challenger/context-propagation'

export const CorrelationIdPropagator = new ContextPropagator<string>()
