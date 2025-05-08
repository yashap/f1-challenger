import { SchemaBuilder } from '@f1-challenger/api-client-utils'
import { PaginationRequestSchema } from '@f1-challenger/pagination'
import { z } from 'zod'

export const DraftPickStatusSchema = z.enum(['Upcoming', 'InProgress', 'Completed'])


export const DraftPickSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  driverId: z.string().uuid(),
  draftId: z.string().uuid(),
  ownerUserId: z.string().uuid(),
  pickNumber: z.bigint(),
  score: z.bigint(),
  status: DraftPickStatusSchema,
})

export const CreateDraftPickRequestSchema = DraftPickSchema.omit({
  id: true, // Generated on the backend]
  ownerUserId: true, // Optional
  createdAt: true, // Generated on the backend
  updatedAt: true, // Generated on the backend
  
}).extend({
  driverId: z.string().uuid().optional(),

})

export const ListDraftPickRequestSchema = PaginationRequestSchema.extend({
  leagueId: z.string().uuid().optional().describe('Fetch members of a given league'),
  userId: z.string().uuid().optional().describe('Fetch leagues user is a member of'),
})

export const ListDraftPickResponseSchema = SchemaBuilder.buildListResponse(DraftPickSchema)

export const DeleteDraftPickRequestSchema = DraftPickSchema.pick({
  draftId: true,
  ownerUserId: true,
})
