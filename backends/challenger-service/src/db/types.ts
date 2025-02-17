import { InputDao } from '@f1-challenger/drizzle-utils'
import { leagueTable, teamTable } from 'src/db/schema'

export type LeagueDao = typeof leagueTable.$inferSelect
export type LeagueInputDao = InputDao<LeagueDao>
export type TeamDao = typeof teamTable.$inferSelect
export type TeamInputDao = InputDao<TeamDao>
