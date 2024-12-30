import { BaseError } from './BaseError'

export interface ServerErrorDto<T = unknown> {
  message: string
  code: string
  metadata?: T
}

export interface ErrorOptions<T = unknown> {
  cause?: unknown
  internalMessage?: string
  metadata?: T
}

export interface WrapErrorOptions<T = unknown> extends Omit<ErrorOptions<T>, 'cause'> {
  message?: string
}

export abstract class ServerError<T = unknown> extends BaseError {
  public readonly code: string
  public readonly internalMessage?: string
  public readonly metadata?: T

  /**
   * Constructs a ServerError
   *
   * @param httpStatusCode If this error bubbles up to a server's response, what HTTP status code should be returned?
   * @param message Describes the error (note, will be returned to clients, and possibly displayed in UIs)
   * @param internalMessage An optional message that can show up in logs, but that should not be returned to clients
   * @param metadata Additional data
   */
  constructor(
    public readonly httpStatusCode: number,
    message: string,
    options: ErrorOptions<T> = {}
  ) {
    super(message, options.cause)
    const { internalMessage, metadata } = options
    this.code = this.name
    this.internalMessage = internalMessage
    this.metadata = metadata
  }

  // Transform this server error into a Data Transfer Object ()
  public toDto(): ServerErrorDto<T> {
    return {
      message: this.message,
      code: this.code,
      ...(this.metadata ? { metadata: this.metadata } : {}),
    }
  }

  public static isServerErrorDto(error: unknown): error is ServerErrorDto {
    const serverError = error as ServerErrorDto
    return Boolean(serverError.message) && Boolean(serverError.code)
  }

  protected static buildOptionsForWrappedError<A = unknown>(
    error: Error,
    options: WrapErrorOptions<A> = {}
  ): { message: string; options: ErrorOptions<A> } {
    const maybeServerError = error as Partial<ServerError>
    const defaultOptions: ErrorOptions<A> = {
      internalMessage: maybeServerError.internalMessage,
      cause: maybeServerError.cause,
    }
    const { message, ...optionOverrides } = options
    return { message: message ?? error.message, options: { ...defaultOptions, ...optionOverrides } }
  }
}
