import { NotFoundError } from '@f1-challenger/errors'

export abstract class BaseController {
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
