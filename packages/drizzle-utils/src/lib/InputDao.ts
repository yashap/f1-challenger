import { Temporal } from '@js-temporal/polyfill'

export type InputDao<T extends { id?: string; createdAt?: Temporal.Instant; updatedAt?: Temporal.Instant }> = Omit<
  T,
  'id' | 'createdAt' | 'updatedAt'
>
