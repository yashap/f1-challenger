import { Temporal } from '@js-temporal/polyfill'
import { sql } from 'drizzle-orm'
import { uuid } from 'drizzle-orm/pg-core'
import { v7 } from 'uuid'
import { instant } from './instant'

export const standardFields = {
  id: uuid()
    .primaryKey()
    .$default(() => v7()),
  createdAt: instant()
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: instant()
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => Temporal.Now.instant()),
}
