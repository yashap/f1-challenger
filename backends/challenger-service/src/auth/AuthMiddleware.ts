import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { middleware } from 'supertokens-node/framework/express'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private supertokensMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>

  constructor() {
    this.supertokensMiddleware = middleware()
  }

  public use(req: Request, res: Response, next: NextFunction): Promise<void> {
    return this.supertokensMiddleware(req, res, next)
  }
}
