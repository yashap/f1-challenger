import ExtendableError from 'extendable-error'

export abstract class BaseError extends ExtendableError {
  public override readonly cause?: Error

  constructor(message?: string, maybeCause?: unknown) {
    super(message)
    this.cause = maybeCause instanceof Error ? maybeCause : undefined
  }
}
