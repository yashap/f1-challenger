import { Temporal } from '@js-temporal/polyfill'
import { z } from 'zod'

const timeRegex = /^(?:[01][0-9]|2[0-3]):[0-5][0-9](?::[0-5][0-9])?$/

export const TimeSchema = z.string().refine((value: string) => {
  try {
    if (!timeRegex.test(value)) {
      return false
    }
    Temporal.PlainTime.from(value)
    return true
  } catch (_error) {
    return false
  }
})
