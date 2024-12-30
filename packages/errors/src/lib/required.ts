import { AssertionError } from './universalErrors'

const DEFAULT_ERROR_MESSAGE = 'Value was unexpectedly null/undefined'

export const required = <T>(value?: T | null, message?: string): T => {
  if (value === null || value === undefined) {
    throw new AssertionError(message ?? DEFAULT_ERROR_MESSAGE)
  }
  return value
}
