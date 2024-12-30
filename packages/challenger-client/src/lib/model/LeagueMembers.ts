import { SchemaBuilder } from '@f1-challenger/api-client-utils'
import { PaginationRequestSchema } from '@f1-challenger/pagination'
import { z } from 'zod'

export const LeagueMembersSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  leagueId: z.string().uuid(),
  userId: z.string().uuid(),
})

export const CreateLeagueMembersRequestSchema = LeagueMembersSchema.omit({
  id: true, // Generated on the backend
  createdAt: true, // Generated on the backend
  updatedAt: true, // Generated on the backend
})

export const ListLeagueMembersRequestSchema = PaginationRequestSchema.extend({
  leagueId: z.string().uuid().optional().describe('Fetch members of a given league'),
  userId: z.string().uuid().optional().describe('Fetch leagues user is a member of'),
})

export const ListLeagueMembersResponseSchema = SchemaBuilder.buildListResponse(LeagueMembersSchema)
