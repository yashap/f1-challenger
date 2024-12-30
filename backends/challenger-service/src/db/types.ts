import { InputDao } from '@f1-challenger/drizzle-utils'
import { parkingSpotTable } from 'src/db/schema'

export type ParkingSpotDao = typeof parkingSpotTable.$inferSelect
export type ParkingSpotInputDao = InputDao<ParkingSpotDao>
