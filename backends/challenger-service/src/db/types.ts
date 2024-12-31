import { InputDao } from '@f1-challenger/drizzle-utils'
import { leagueTable, leagueMemberTable } from 'src/db/schema'

export type LeagueDao = typeof leagueTable.$inferSelect
export type LeagueInputDao = InputDao<LeagueDao>
export type LeagueMemberDao = typeof leagueMemberTable.$inferSelect
export type LeagueMemberInputDao = InputDao<LeagueMemberDao>
