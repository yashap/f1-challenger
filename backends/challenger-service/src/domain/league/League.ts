import { InstantStringSchema } from '@f1-challenger/api-client-utils'
import { LeagueDto } from '@f1-challenger/challenger-client'
import { AsPagination, Cursor } from '@f1-challenger/pagination'
import { formatInstantFields } from '@f1-challenger/time'
import { Temporal } from '@js-temporal/polyfill'
import { z } from 'zod'
import { LeagueDao } from 'src/db/types'

export type League = LeagueDao
export type ListLeagueCursor = Cursor<'createdAt', Temporal.Instant>
export type ListLeaguePagination = AsPagination<ListLeagueCursor>

const ListLeagueOrderingSchema = z.object({
  orderBy: z.literal('createdAt'),
  lastOrderValueSeen: InstantStringSchema,
})

export const parseLeagueOrdering = (ordering: {
  orderBy: unknown
  lastOrderValueSeen: unknown
}): Pick<ListLeagueCursor, 'orderBy' | 'lastOrderValueSeen'> => {
  return ListLeagueOrderingSchema.parse(ordering)
}

export const leagueToDto = (league: League): LeagueDto => {
  return {
    ...league,
    ...formatInstantFields(league, ['createdAt', 'updatedAt']),
    description: league.description ?? undefined,
  }
}
