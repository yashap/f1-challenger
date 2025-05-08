import { SchemaBuilder } from '@f1-challenger/api-client-utils'
import { PaginationRequestSchema } from '@f1-challenger/pagination'
import { z } from 'zod'

export const DraftStatusSchema = z.enum(['DraftInProgress', 'DraftComplete'])

export const DraftSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  leagueId: z.string().uuid(),
  status: DraftStatusSchema,
})

export const CreateDraftRequestSchema = DraftSchema.omit({
  id: true, // Generated on the backend]
  createdAt: true, // Generated on the backend
  updatedAt: true, // Generated on the backend
  status: true, // Generated on the backend
})

export const ListDraftRequestSchema = PaginationRequestSchema.extend({
  status: z.string().uuid().optional().describe('Fetch races based on status'),
})

export const ListDraftResponseSchema = SchemaBuilder.buildListResponse(DraftSchema)


export const DeleteDraftRequestSchema = DraftSchema.pick({
  id: true,
})
