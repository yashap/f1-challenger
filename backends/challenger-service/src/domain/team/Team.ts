import { InstantStringSchema } from '@f1-challenger/api-client-utils'
import { TeamDto } from '@f1-challenger/challenger-client'
import { AsPagination, Cursor } from '@f1-challenger/pagination'
import { formatInstantFields } from '@f1-challenger/time'
import { Temporal } from '@js-temporal/polyfill'
import { z } from 'zod'
import { TeamDao } from 'src/db/types'

export type Team = TeamDao
export type ListTeamCursor = Cursor<'createdAt', Temporal.Instant>
export type ListTeamPagination = AsPagination<ListTeamCursor>

const ListTeamOrderingSchema = z.object({
  orderBy: z.literal('createdAt'),
  lastOrderValueSeen: InstantStringSchema,
})

export const parseTeamOrdering = (ordering: {
  orderBy: unknown
  lastOrderValueSeen: unknown
}): Pick<ListTeamCursor, 'orderBy' | 'lastOrderValueSeen'> => {
  return ListTeamOrderingSchema.parse(ordering)
}

export const teamToDto = (team: Team): TeamDto => {
  return {
    ...team,
    ...formatInstantFields(team, ['createdAt', 'updatedAt']),
  }
}
