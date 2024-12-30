import { ServerError } from '@f1-challenger/errors'
import { Logger, Payload } from '@f1-challenger/logging'
import { Request, Response } from 'express'
import { keys, pick } from 'lodash'
import { NestFunctionalMiddleware } from './NestFunctionalMiddleware'
import { onResponseComplete } from './onResponseComplete'

const logger: Logger = new Logger('HttpRequest')

const getStatusCode = (res: Response, error?: Error): number => {
  const serverError: ServerError | undefined = error && error instanceof ServerError ? error : undefined
  const errorStatus: number | undefined = serverError?.httpStatusCode ?? (error ? 500 : undefined)
  return errorStatus ?? res.statusCode
}

const logResponse = (
  req: Pick<Request, 'method' | 'path' | 'query'>,
  res: Response,
  startMilliseconds: number,
  error?: Error
): void => {
  const queryKeys = keys(req.query)
  const status = getStatusCode(res, error)
  const payload: Payload = {
    error,
    status,
    method: req.method,
    path: req.path,
    durationMs: Date.now() - startMilliseconds,
    queryKeys: queryKeys.length > 0 ? queryKeys : undefined,
  }

  if (status >= 500) {
    logger.error('Returning 5xx error', payload)
  } else if (status >= 400) {
    logger.warn('Returning 4xx error', payload)
  } else if (req.method.toLowerCase() === 'options' || req.path === '/' || req.path === '/metrics') {
    // These requests are noise/uninteresting
    logger.trace('Request completed successfully', payload)
  } else {
    logger.info('Request completed successfully', payload)
  }
}

export const logMiddleware: NestFunctionalMiddleware = (req, res, next) => {
  const startMilliseconds = Date.now()
  // In case request gets mutated, get it on the way in
  const request = pick(req, ['method', 'path', 'query'])
  onResponseComplete(res)((error) => {
    logResponse(request, res, startMilliseconds, error)
  })
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (next) {
    try {
      next()
    } catch (error) {
      next(error)
    }
  }
}
