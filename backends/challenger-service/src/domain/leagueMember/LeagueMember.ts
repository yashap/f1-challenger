import { InstantStringSchema } from '@f1-challenger/api-client-utils'
import { LeagueMemberDto } from '@f1-challenger/challenger-client'
import { AsPagination, Cursor } from '@f1-challenger/pagination'
import { formatInstantFields } from '@f1-challenger/time'
import { Temporal } from '@js-temporal/polyfill'
import { z } from 'zod'
import { LeagueMemberDao } from 'src/db/types'

export type LeagueMember = LeagueMemberDao
export type ListLeagueMemberCursor = Cursor<'createdAt', Temporal.Instant>
export type ListLeagueMemberPagination = AsPagination<ListLeagueMemberCursor>

const ListLeagueMemberOrderingSchema = z.object({
  orderBy: z.literal('createdAt'),
  lastOrderValueSeen: InstantStringSchema,
})

export const parseLeagueMemberOrdering = (ordering: {
  orderBy: unknown
  lastOrderValueSeen: unknown
}): Pick<ListLeagueMemberCursor, 'orderBy' | 'lastOrderValueSeen'> => {
  return ListLeagueMemberOrderingSchema.parse(ordering)
}

export const leagueMemberToDto = (leagueMember: LeagueMember): LeagueMemberDto => {
  return {
    ...leagueMember,
    ...formatInstantFields(leagueMember, ['createdAt', 'updatedAt']),
  }
}
