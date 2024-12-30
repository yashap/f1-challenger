import { LeagueStatusAllValues } from '@f1-challenger/challenger-client'
import { standardFields } from '@f1-challenger/drizzle-utils'
import { uuid, pgTable, text, index } from 'drizzle-orm/pg-core'

export const leagueTable = pgTable(
  'League',
  {
    ...standardFields,
    adminUserId: uuid().notNull(),
    name: text().notNull(),
    description: text(),
    status: text({ enum: LeagueStatusAllValues })
      .notNull()
      .references(() => _values_league_Status.status),
  },
  (table) => [index('League_adminUserId_idx').on(table.adminUserId)]
)

// 'AcceptingUsers', 'Started'
export const _values_league_Status = pgTable('values_League_status', {
  status: text().primaryKey(),
})
