import { IllegalInputError } from '@f1-challenger/errors'
import { Temporal } from '@js-temporal/polyfill'
import { pick } from 'lodash'

export const formatInstantFields = <T extends Record<string, unknown>, F extends keyof T>(
  obj: T,
  fieldNames: F[],
  ErrorConstructor: new (message: string) => Error = IllegalInputError
): Record<F, string> => {
  const fields = pick(obj, fieldNames)
  const entries = Object.entries(fields)
  if (entries.length !== fieldNames.length) {
    const actualFieldNames = new Set([...entries].map(([key, _value]) => key))
    const missingFieldName = fieldNames.filter((fieldName) => !actualFieldNames.has(fieldName as string))
    throw new ErrorConstructor(`Missing field names: ${missingFieldName.join(', ')}`)
  }
  return Object.fromEntries(
    entries.map(([key, value]) => {
      if (value instanceof Temporal.Instant) {
        return [key, value.toString()]
      }
      throw new ErrorConstructor(`${key} was not an Instant`)
    })
  ) as Record<F, string>
}
