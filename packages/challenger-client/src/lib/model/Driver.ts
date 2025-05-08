import { SchemaBuilder } from '@f1-challenger/api-client-utils'
import { PaginationRequestSchema } from '@f1-challenger/pagination'
import { z } from 'zod'

export const DriverSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  leagueId: z.string().uuid(),
  name: z.string(),
  team: z.string(),
})

// REMOVED DRIVER CREATE AS A USER CANNOT CREATE DRIVERS ? OR SHOULD THIS BE KEPT AS THIS WILL NEED TO BE AN API CALL TO F1 SITE
/*
export const CreateDriverRequestSchema = DriverSchema.omit({
  id: true, // Generated on the backend]
  createdAt: true, // Generated on the backend
  updatedAt: true, // Generated on the backend
})
*/
export const ListDriverRequestSchema = PaginationRequestSchema.extend({
  name: z.string().optional().describe('Fetch drivers based on name'),
  team: z.string().optional().describe('Fetch drivers based on team'),
})

export const ListDriverResponseSchema = SchemaBuilder.buildListResponse(DriverSchema)

// REMOVED DRIVER DELETE AS NO NEED TO DELETE DRIVERS
/*
export const DeleteDriverRequestSchema = DriverSchema.pick({
  id: true,
})
*/
