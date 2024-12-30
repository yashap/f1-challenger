import { SchemaBuilder } from '@f1-challenger/api-client-utils'
import { PaginationRequestSchema } from '@f1-challenger/pagination'
import { z } from 'zod'

export const LeagueStatusSchema = z.enum(['AcceptingUsers', 'Started'])

export const LeagueSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  name: z.string(),
  description: z.string().optional(),
  adminUserId: z.string().uuid(),
  status: LeagueStatusSchema,
})

export const CreateLeagueRequestSchema = LeagueSchema.omit({
  id: true, // Generated on the backend
  createdAt: true, // Generated on the backend
  updatedAt: true, // Generated on the backend
  adminUserId: true, // Implied from session
  status: true, // Generated on the backend
})

export const UpdateLeagueRequestSchema = LeagueSchema.omit({
  id: true, // Generated on the backend
  createdAt: true, // Generated on the backend
  updatedAt: true, // Generated on the backend
  adminUserId: true, // Implied from session
}).partial()

export const ListLeaguesRequestSchema = PaginationRequestSchema.extend({
  adminUserId: z.string().uuid().optional().describe('Fetch leagues administracted by this user'),
})

export const ListLeaguesResponseSchema = SchemaBuilder.buildListResponse(LeagueSchema)
