import { SchemaBuilder } from '@f1-challenger/api-client-utils'
import { PaginationRequestSchema } from '@f1-challenger/pagination'
import { z } from 'zod'

export const RaceStatusSchema = z.enum(['Upcoming', 'AwaitingDraft', 'DraftIn-Progress', 'DraftComplete', 'RaceIn-Progress', 'RaceComplete'])

export const RaceSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  scheduledStartTime: z.string().datetime(),
  draftId: z.string().uuid().optional(),
  name: z.string(),
  description: z.string().optional(),
  status: RaceStatusSchema,
})

export const ListRaceRequestSchema = PaginationRequestSchema.extend({
  status: z.string().uuid().optional().describe('Fetch races based on status'),
})

export const ListRaceResponseSchema = SchemaBuilder.buildListResponse(RaceSchema)
