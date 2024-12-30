import { Temporal } from '@js-temporal/polyfill'
import { z } from 'zod'

/**
 * Schema for an Instant represented as a string - when you parse it, it gets transformed into an Instant.
 */
export const InstantStringSchema = z.string().transform((val, ctx) => {
  try {
    return Temporal.Instant.from(val)
  } catch (_error) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      fatal: true,
      message: 'Not a valid instant',
    })
    return z.NEVER
  }
})
