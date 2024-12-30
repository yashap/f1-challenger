import { Temporal } from '@js-temporal/polyfill'
import { customType } from 'drizzle-orm/pg-core'

export interface InstantConfig {
  withTimezone: boolean
  precision: number
}

const defaultInstantConfig: InstantConfig = {
  // store the timezone in the database
  withTimezone: true,

  // 3 fractional digits on the seconds field, e.g. millisecond precision
  precision: 3,
}

/**
 * A custom type for storing Temporal.Instant values in a PostgreSQL database, as Postgres TIMESTAMPs
 */
export const instant = customType<{
  data: Temporal.Instant
  driverData: string
  config: Partial<InstantConfig>
}>({
  dataType(partialConfig: Partial<InstantConfig> | undefined) {
    const config = { ...defaultInstantConfig, ...partialConfig }
    return `TIMESTAMP(${config.precision})${config.withTimezone ? ' WITH TIME ZONE' : ''}`
  },

  fromDriver(value: string): Temporal.Instant {
    return Temporal.Instant.from(value)
  },

  toDriver(value: Temporal.Instant): string {
    return value.toString({ timeZone: 'UTC' })
  },
})
