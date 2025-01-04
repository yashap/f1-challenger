import { NotFoundError } from '@f1-challenger/errors'
import { Logger } from '@f1-challenger/logging'

export abstract class BaseController {
  protected readonly logger: Logger = new Logger(this.constructor.name)

  constructor(protected readonly entityName: string) {}

  protected getEntityOrNotFound<T>(maybeValue: T | undefined): T {
    if (!maybeValue) {
      throw this.buildEntityNotFoundError()
    }
    return maybeValue as T
  }

  protected buildEntityNotFoundError(): NotFoundError {
    return new NotFoundError(`${this.entityName} not found`)
  }
}
