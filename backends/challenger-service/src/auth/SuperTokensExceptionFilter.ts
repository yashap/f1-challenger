import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common'
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express'
import { Error as SuperTokensError } from 'supertokens-node'
import { errorHandler } from 'supertokens-node/framework/express'

@Catch(SuperTokensError)
export class SuperTokensExceptionFilter implements ExceptionFilter {
  private handler: ErrorRequestHandler

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.handler = errorHandler()
  }

  public catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()

    const resp = ctx.getResponse<Response>()
    if (resp.headersSent) {
      return
    }

    this.handler(exception, ctx.getRequest<Request>(), resp, ctx.getNext<NextFunction>())
  }
}
