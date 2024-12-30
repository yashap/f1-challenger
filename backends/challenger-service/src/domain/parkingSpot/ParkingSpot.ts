import { InstantStringSchema } from '@f1-challenger/api-client-utils'
import { ParkingSpotDto } from '@f1-challenger/challenger-client'
import { Cursor } from '@f1-challenger/pagination'
import { formatInstantFields } from '@f1-challenger/time'
import { Temporal } from '@js-temporal/polyfill'
import { z } from 'zod'
import { ParkingSpotDao } from 'src/db/types'

export type ParkingSpot = ParkingSpotDao

export type ListParkingSpotCursor = Cursor<'createdAt', Temporal.Instant>

const ListParkingSpotOrderingSchema = z.object({
  orderBy: z.literal('createdAt'),
  lastOrderValueSeen: InstantStringSchema,
})

export const parseParkingSpotOrdering = (ordering: {
  orderBy: unknown
  lastOrderValueSeen: unknown
}): Pick<ListParkingSpotCursor, 'orderBy' | 'lastOrderValueSeen'> => {
  return ListParkingSpotOrderingSchema.parse(ordering)
}

export type ListParkingSpotPagination =
  | ListParkingSpotCursor
  | Omit<ListParkingSpotCursor, 'lastOrderValueSeen' | 'lastIdSeen'>

export const parkingSpotToDto = (parkingSpot: ParkingSpot): ParkingSpotDto => {
  return {
    ...parkingSpot,
    ...formatInstantFields(parkingSpot, ['createdAt', 'updatedAt']),
  }
}
