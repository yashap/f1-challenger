import { NextFunction, Request, Response } from 'express'

export type NestFunctionalMiddleware = (request: Request, response: Response, next: NextFunction) => void
