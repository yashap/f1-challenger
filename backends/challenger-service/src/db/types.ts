import { InputDao } from '@f1-challenger/drizzle-utils'
import { leagueTable } from 'src/db/schema'

export type LeagueDao = typeof leagueTable.$inferSelect
export type LeagueInputDao = InputDao<LeagueDao>
