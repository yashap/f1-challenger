import { Logger, Payload } from '@f1-challenger/logging'
import { LoggerService } from '@nestjs/common'

export class NestLogger implements LoggerService {
  private readonly underlyingLogger: Logger

  constructor(name?: string) {
    this.underlyingLogger = new Logger(name ?? 'NestJS')
  }

  public error(message: string, ...optionalParams: unknown[]): void {
    this.underlyingLogger.error(message, NestLogger.toPayload(optionalParams))
  }

  public warn(message: string, ...optionalParams: unknown[]): void {
    this.underlyingLogger.warn(message, NestLogger.toPayload(optionalParams))
  }

  public log(message: string, ...optionalParams: unknown[]): void {
    this.underlyingLogger.info(message, NestLogger.toPayload(optionalParams))
  }

  public debug?(message: string, ...optionalParams: unknown[]): void {
    this.underlyingLogger.debug(message, NestLogger.toPayload(optionalParams))
  }

  public verbose?(message: string, ...optionalParams: unknown[]): void {
    this.underlyingLogger.trace(message, NestLogger.toPayload(optionalParams))
  }

  private static toPayload(optionalParams: unknown[]): Payload {
    return optionalParams.length > 0 ? { nestJsData: optionalParams } : {}
  }
}
