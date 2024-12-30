import { Temporal } from '@js-temporal/polyfill'
import { customType } from 'drizzle-orm/pg-core'

/**
 * A custom type for storing Temporal.PlainTime values in a PostgreSQL database, as Postgres TIMEs
 */
export const plainTime = customType<{
  data: Temporal.PlainTime
  driverData: string
}>({
  dataType() {
    return 'TIME WITHOUT TIME ZONE'
  },

  fromDriver(value: string): Temporal.PlainTime {
    return Temporal.PlainTime.from(value)
  },

  toDriver(value: Temporal.PlainTime): string {
    return value.toString({ smallestUnit: 'seconds' })
  },
})
