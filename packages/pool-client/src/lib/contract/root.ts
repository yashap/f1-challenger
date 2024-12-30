import { initContract } from '@ts-rest/core'
import { parkingSpotContract } from './parkingSpot'

const c = initContract()

export const contract = c.router(
  {
    parkingSpots: parkingSpotContract,
  },
  {
    strictStatusCodes: true,
    pathPrefix: '/challenger',
  }
)
