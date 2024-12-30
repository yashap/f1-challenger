import {
  EndpointNotFoundError,
  InputValidationError,
  ResponseValidationError,
  ServerError,
  ServerErrorDto,
  UnknownError,
} from '@f1-challenger/errors'
import { Logger } from '@f1-challenger/logging'
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpServer,
  HttpException as NestHttpException,
  NotFoundException as NestNotFoundException,
} from '@nestjs/common'
import { RequestValidationError, ResponseValidationError as TsRestResponseValidationError } from '@ts-rest/nest'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter<unknown> {
  private readonly logger: Logger = new Logger(HttpExceptionFilter.name)
  private static endpointNotFoundRegex = /^Cannot (GET|POST|PATCH|PUT|DELETE) \//

  constructor(private readonly server: HttpServer<unknown, unknown>) {}

  public catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const status = HttpExceptionFilter.getStatus(error)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response = ctx.getResponse()
    const responseBody = HttpExceptionFilter.getServerErrorDto(error)
    if (status >= 500) {
      this.logger.error('Caught exception', { error, status, responseBody })
    } else {
      this.logger.warn('Caught exception', { error, status, responseBody })
    }
    this.server.reply(response, responseBody, status)
  }

  private static getStatus(error: Error): number {
    if (error instanceof ServerError) {
      return error.httpStatusCode
    }
    if (error instanceof NestHttpException) {
      return error.getStatus()
    }
    return HttpStatus.INTERNAL_SERVER_ERROR
  }

  private static getServerErrorDto(error: Error): ServerErrorDto {
    if (error instanceof ServerError) {
      return error.toDto()
    }
    if (error instanceof NestHttpException) {
      const serverError = this.nestExceptionToServerError(error)
      return serverError.toDto()
    }
    return UnknownError.wrap(error).toDto()
  }

  private static nestExceptionToServerError(error: NestHttpException): ServerError {
    if (error instanceof RequestValidationError) {
      return new InputValidationError('Invalid request', {
        cause: error,
        metadata: {
          ...(error.pathParams && { pathParamErrors: error.pathParams.issues }),
          ...(error.body && { bodyErrors: error.body.issues }),
          ...(error.query && { queryErrors: error.query.issues }),
        },
      })
    }
    if (error instanceof TsRestResponseValidationError) {
      return new ResponseValidationError('Invalid response', {
        cause: error,
        metadata: {
          details: error.error.issues,
        },
      })
    }
    if (error instanceof NestNotFoundException && HttpExceptionFilter.endpointNotFoundRegex.test(error.message)) {
      return new EndpointNotFoundError('Endpoint not found', {
        cause: error,
      })
    }
    return new UnknownError(error.message, error.getStatus(), {
      cause: error,
      metadata: { details: error.getResponse() },
    })
  }
}
