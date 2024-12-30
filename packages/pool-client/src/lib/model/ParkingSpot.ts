import { PointSchema, SchemaBuilder } from '@f1-challenger/api-client-utils'
import { PaginationRequestSchema } from '@f1-challenger/pagination'
import { z } from 'zod'

export const ParkingSpotSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  ownerUserId: z.string().uuid(),
  address: z.string(),
  location: PointSchema,
  timeZone: z.string(),
})

export const CreateParkingSpotRequestSchema = ParkingSpotSchema.omit({
  id: true, // Generated on the backend
  createdAt: true, // Generated on the backend
  updatedAt: true, // Generated on the backend
  ownerUserId: true, // Implied from session
  timeZone: true, // Implied from location
})

export const UpdateParkingSpotRequestSchema = CreateParkingSpotRequestSchema.partial()

export const ListParkingSpotsRequestSchema = PaginationRequestSchema.extend({
  ownerUserId: z.string().uuid().optional().describe('Fetch parking spots owned by this user'),
})

export const ListParkingSpotsClosestToPointRequestSchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  limit: z.coerce.number().min(1).max(200).optional(),
})

export const ListParkingSpotsResponseSchema = SchemaBuilder.buildListResponse(ParkingSpotSchema)

export const ListParkingSpotsClosestToPointResponseSchema = z.object({
  data: z.array(ParkingSpotSchema),
})
