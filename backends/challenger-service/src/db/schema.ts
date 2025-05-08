import { 
    LeagueStatusAllValues,
    RaceStatusAllValues,

 } from '@f1-challenger/challenger-client'
import { standardFields } from '@f1-challenger/drizzle-utils'
import { relations } from 'drizzle-orm'
import { uuid, pgTable, text, index } from 'drizzle-orm/pg-core'

// LEAGUE TABLE
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

export const teamTable = pgTable(
  'Team',
  {
    ...standardFields,
    leagueId: uuid()
      .notNull()
      .references(() => leagueTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    userId: uuid().notNull(),
    name: text().notNull(),
  },
  (table) => [index('Team_leagueId_idx').on(table.leagueId), index('Team_userId_idx').on(table.userId)]
)

export const leagueRelations = relations(leagueTable, ({ many }) => ({
  teams: many(teamTable),
}))




// 'AcceptingUsers', 'Started'
export const _values_league_Status = pgTable('values_League_status', {
  status: text().primaryKey(),
})

//LEAGUE MEMBER TABLE

export const leagueMemberTable = pgTable(
  'LeagueMember',
  {
    ...standardFields,
    leagueId: uuid()
      .notNull()
      .references(() => leagueTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    userId: uuid().notNull(),
  },
  (table) => [index('LeagueMember_leagueId_idx').on(table.leagueId), index('LeagueMember_userId_idx').on(table.userId)]
)


// RACE TABLE

export const raceTable = pgTable(
  'Race',
  {
    ...standardFields,
    scheduledStartTime: datetime().nutNull(),
    draftId: uuid()
      .notNull()
      .references(() => draftTable.id),
    name: text().notNull(),
    description: text(),
    status: text({ enum: RaceStatusAllValues })
      .notNull()
      .references(() => _values_race_Status.status),
  },
  (table) => [index('LeagueMember_leagueId_idx').on(table.leagueId), index('LeagueMember_userId_idx').on(table.userId)]
)

// 'Upcoming', 'AwaitingDraft', 'DraftIn-Progress', 'DraftComplete', 'RaceIn-Progress', 'RaceComplete'
export const _values_race_Status = pgTable('values_rac_status', {
  status: text().primaryKey(),
})