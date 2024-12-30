import { AppRoute, AppRouter } from '@ts-rest/core'
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest'

// A decorator for our endpoints
export const Endpoint = (appRouterOrRoute: AppRouter | AppRoute): MethodDecorator =>
  TsRestHandler(appRouterOrRoute, {
    validateResponses: true,
    validateRequestQuery: true,
    validateRequestBody: true,
  })

// A function endpoints should call in their implementations
export const handler = tsRestHandler

// The type of the value returned by `handler`
export type HandlerResult<T extends AppRouter | AppRoute> = ReturnType<typeof handler<T>>
