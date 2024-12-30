import { InputValidationError } from '@f1-challenger/errors'
import { Temporal } from '@js-temporal/polyfill'
import { isString, pick } from 'lodash'

export const parseInstantFields = <T extends Record<string, unknown>, F extends keyof T>(
  obj: T,
  fieldNames: F[],
  ErrorConstructor: new (message: string) => Error = InputValidationError
): Record<F, Temporal.Instant> => {
  const fields = pick(obj, fieldNames)
  const entries = Object.entries(fields)
  if (entries.length !== fieldNames.length) {
    const actualFieldNames = new Set([...entries].map(([key, _value]) => key))
    const missingFieldName = fieldNames.filter((fieldName) => !actualFieldNames.has(fieldName as string))
    throw new ErrorConstructor(`Missing field names: ${missingFieldName.join(', ')}`)
  }
  return Object.fromEntries(
    entries.map(([key, value]) => {
      if (isString(value)) {
        try {
          return [key, Temporal.Instant.from(value)]
        } catch (_error) {
          throw new ErrorConstructor(`Value of field ${key} must be an ISO 8601 timestamp string, with a time offset`)
        }
      }
      if (value instanceof Date) {
        return [key, Temporal.Instant.fromEpochMilliseconds(value.valueOf())]
      }
      throw new ErrorConstructor(
        `Value of field ${key} must be an ISO 8601 timestamp string, with a time offset, or a date`
      )
    })
  ) as unknown as Record<F, Temporal.Instant>
}
