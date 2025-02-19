import { SchemaBuilder } from '@f1-challenger/api-client-utils'
import { PaginationRequestSchema } from '@f1-challenger/pagination'
import { z } from 'zod'

export const TeamSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  leagueId: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string(),
})

export const CreateTeamRequestSchema = TeamSchema.omit({
  id: true, // Generated on the backend]
  userId: true, // Optional
  createdAt: true, // Generated on the backend
  updatedAt: true, // Generated on the backend
}).extend({
  userId: z.string().uuid().optional(),
})

export const UpdateTeamRequestSchema = TeamSchema.omit({
  id: true, // Generated on the backend]
  userId: true, // Optional
  createdAt: true, // Generated on the backend
  updatedAt: true, // Generated on the backend
}).partial()

export const ListTeamRequestSchema = PaginationRequestSchema.extend({
  leagueId: z.string().uuid().optional().describe('Fetch teams in a given league'),
  userId: z.string().uuid().optional().describe("Fetch a specific user's teams"),
})

export const ListTeamResponseSchema = SchemaBuilder.buildListResponse(TeamSchema)
