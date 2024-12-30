import { isEmpty } from 'lodash'
import { ErrorOptions, ServerError, WrapErrorOptions } from './ServerError'

/**
 * 4xx errors
 */

export class InputValidationError<T = unknown> extends ServerError<T> {
  constructor(message: string, options: ErrorOptions<T> = {}) {
    super(400, message, options)
  }

  public static wrap<A = unknown>(error: Error, optionOverrides: WrapErrorOptions<A> = {}): InputValidationError<A> {
    const { message, options } = this.buildOptionsForWrappedError(error, optionOverrides)
    return new InputValidationError(message, options)
  }
}

export class ForbiddenError<T = unknown> extends ServerError<T> {
  constructor(message: string, options: ErrorOptions<T> = {}) {
    super(403, message, options)
  }

  public static wrap<A = unknown>(error: Error, optionOverrides: WrapErrorOptions<A> = {}): ForbiddenError<A> {
    const { message, options } = this.buildOptionsForWrappedError(error, optionOverrides)
    return new ForbiddenError(message, options)
  }
}

export class NotFoundError<T = unknown> extends ServerError<T> {
  constructor(message: string, options: ErrorOptions<T> = {}) {
    super(404, message, options)
  }

  public static wrap<A = unknown>(error: Error, optionOverrides: WrapErrorOptions<A> = {}): NotFoundError<A> {
    const { message, options } = this.buildOptionsForWrappedError(error, optionOverrides)
    return new NotFoundError(message, options)
  }
}

export class EndpointNotFoundError<T = unknown> extends ServerError<T> {
  constructor(message: string, options: ErrorOptions<T> = {}) {
    super(404, message, options)
  }

  public static wrap<A = unknown>(error: Error, optionOverrides: WrapErrorOptions<A> = {}): EndpointNotFoundError<A> {
    const { message, options } = this.buildOptionsForWrappedError(error, optionOverrides)
    return new EndpointNotFoundError(message, options)
  }
}

/**
 * 5xx errors
 */

export class InternalServerError<T = unknown> extends ServerError<T> {
  constructor(message: string, options: ErrorOptions<T> = {}) {
    super(500, message, options)
  }

  public static wrap<A = unknown>(error: Error, optionOverrides: WrapErrorOptions<A> = {}): InternalServerError<A> {
    const { message, options } = this.buildOptionsForWrappedError(error, optionOverrides)
    return new InternalServerError(message, options)
  }
}

export class ResponseValidationError<T = unknown> extends ServerError<T> {
  constructor(message: string, options: ErrorOptions<T> = {}) {
    super(500, message, options)
  }

  public static wrap<A = unknown>(error: Error, optionOverrides: WrapErrorOptions<A> = {}): ResponseValidationError<A> {
    const { message, options } = this.buildOptionsForWrappedError(error, optionOverrides)
    return new ResponseValidationError(message, options)
  }
}

export class UnknownError<T = unknown> extends ServerError<T> {
  constructor(message: string, httpStatusCode = 500, options: ErrorOptions<T> = {}) {
    super(httpStatusCode, message, options)
  }

  public static wrap<A = unknown>(
    error: Error,
    httpStatusCode = 500,
    optionOverrides: WrapErrorOptions<A> = {}
  ): UnknownError<A> {
    const { message, options } = this.buildOptionsForWrappedError(error, optionOverrides)
    return new UnknownError(message, httpStatusCode, options)
  }
}

/**
 * Utilities
 */

export const buildServerErrorFromDto = (dto: unknown, statusCode: number): ServerError => {
  if (isEmpty(dto) && statusCode === 404) {
    return new EndpointNotFoundError('Endpoint not found')
  }
  if (ServerError.isServerErrorDto(dto)) {
    const options = { cause: dto, metadata: dto.metadata }
    if (statusCode === 400 && dto.code === InputValidationError.name) {
      return new InputValidationError(dto.message, options)
    } else if (statusCode === 403 && dto.code === ForbiddenError.name) {
      return new ForbiddenError(dto.message, options)
    } else if (statusCode === 404 && dto.code === NotFoundError.name) {
      return new NotFoundError(dto.message, options)
    } else if (statusCode === 404 && dto.code === EndpointNotFoundError.name) {
      return new EndpointNotFoundError(dto.message, options)
    } else if (statusCode === 500 && dto.code === InternalServerError.name) {
      return new InternalServerError(dto.message, options)
    } else if (statusCode === 500 && dto.code === ResponseValidationError.name) {
      return new ResponseValidationError(dto.message, options)
    } else if (dto.code === UnknownError.name) {
      return new UnknownError(dto.message, statusCode, options)
    }
  }
  return new UnknownError('Unexpected response from server', statusCode, {
    cause: dto,
    metadata: { response: { body: dto } },
  })
}
