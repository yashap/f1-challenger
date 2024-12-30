import { SupertestInstance } from '@f1-challenger/api-client-test-utils'
import {
  ChallengerClient,
  CreateParkingSpotRequest,
  ParkingSpotDto,
  UpdateParkingSpotRequest,
} from '@f1-challenger/challenger-client'
import { ForbiddenError, required } from '@f1-challenger/errors'
import { Point } from '@f1-challenger/geography'
import { OrderDirectionValues } from '@f1-challenger/pagination'
import { Temporal } from '@js-temporal/polyfill'
import { INestApplication } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { omit, orderBy, sortBy } from 'lodash'
import { v4 as uuid } from 'uuid'
import { AuthGuard } from 'src/auth'
import { Db } from 'src/db/Db'
import { parkingSpotTable } from 'src/db/schema'
import { ParkingSpotController } from 'src/domain/parkingSpot/ParkingSpotController'
import { buildTestApp } from 'src/test/buildTestApp'
import { expectSystemTimestampStrings } from 'src/test/expectSystemTimestamp'

describe(ParkingSpotController.name, () => {
  let app: INestApplication
  let landlordUserId: string
  let renterUserId: string
  let landlordChallengerClient: ChallengerClient
  let renterChallengerClient: ChallengerClient

  beforeEach(async () => {
    landlordUserId = uuid()
    renterUserId = uuid()

    app = await buildTestApp()
    landlordChallengerClient = new ChallengerClient(
      new SupertestInstance(app.getHttpServer(), AuthGuard.buildTestAuthHeaders(landlordUserId))
    )
    renterChallengerClient = new ChallengerClient(
      new SupertestInstance(app.getHttpServer(), AuthGuard.buildTestAuthHeaders(renterUserId))
    )
  })

  describe('Individual item endpoints', () => {
    let parkingSpot: ParkingSpotDto

    beforeEach(async () => {
      const parkingSpotPostBody: CreateParkingSpotRequest = {
        address: '90210 Fancy Street',
        location: { longitude: 10, latitude: 20 },
      }
      parkingSpot = await landlordChallengerClient.parkingSpots.create(parkingSpotPostBody)
      const { id: parkingSpotId, ownerUserId, timeZone, createdAt, updatedAt, ...otherParkingSpotData } = parkingSpot
      expect(parkingSpotId).toBeDefined()
      expect(ownerUserId).toBe(landlordUserId)
      expect(timeZone).toBe('Africa/Lagos')
      expectSystemTimestampStrings({ createdAt, updatedAt })
      expect(otherParkingSpotData).toStrictEqual(parkingSpotPostBody)
    })

    describe('getById', () => {
      it('landlord should be able to get own parking spot by id', async () => {
        expect(await landlordChallengerClient.parkingSpots.get(parkingSpot.id)).toStrictEqual(parkingSpot)
      })

      it('renter should be able to get parking spot by id', async () => {
        expect(await renterChallengerClient.parkingSpots.get(parkingSpot.id)).toStrictEqual(parkingSpot)
      })

      it('should verify that a parking spot does not exist', async () => {
        expect(await landlordChallengerClient.parkingSpots.get(uuid())).toBeUndefined()
      })

      describe('update', () => {
        it('landlord should be able to update a parking spot', async () => {
          const update: UpdateParkingSpotRequest = { location: { longitude: 2, latitude: 3 } }
          expect(
            omit(await landlordChallengerClient.parkingSpots.update(parkingSpot.id, update), ['updatedAt'])
          ).toStrictEqual({
            ...omit(parkingSpot, ['updatedAt']),
            ...update,
            timeZone: 'Etc/GMT',
          })
        })

        it('renter should not be able to update a parking spot', async () => {
          const update: UpdateParkingSpotRequest = { location: { longitude: 2, latitude: 3 } }
          await expect(renterChallengerClient.parkingSpots.update(parkingSpot.id, update)).rejects.toThrow(
            ForbiddenError
          )

          // And assert it wasn't modified
          expect(await renterChallengerClient.parkingSpots.get(parkingSpot.id)).toStrictEqual(parkingSpot)
        })
      })

      describe('delete', () => {
        it('landlord should be able to delete a parking spot', async () => {
          expect(await landlordChallengerClient.parkingSpots.get(parkingSpot.id)).toBeDefined()
          await landlordChallengerClient.parkingSpots.delete(parkingSpot.id)

          // And assert it's deleted
          expect(await landlordChallengerClient.parkingSpots.get(parkingSpot.id)).toBeUndefined()
        })

        it('renter should not be able to delete a parking spot', async () => {
          expect(await renterChallengerClient.parkingSpots.get(parkingSpot.id)).toBeDefined()
          await expect(renterChallengerClient.parkingSpots.delete(parkingSpot.id)).rejects.toThrow(ForbiddenError)

          // And assert it's not deleted
          expect(await renterChallengerClient.parkingSpots.get(parkingSpot.id)).toBeDefined()
        })
      })
    })
  })

  describe('List endpoints', () => {
    let allSpots: ParkingSpotDto[] = []
    const now: Temporal.Instant = Temporal.Now.instant()

    beforeEach(async () => {
      allSpots = []
      for (let idx = 0; idx < 20; idx++) {
        const parkingSpot = await landlordChallengerClient.parkingSpots.create({
          address: '90210 Fancy Street',
          location: { longitude: idx, latitude: idx },
        })
        // Different createdAt for easy to test ordering
        const instant = now.add(Temporal.Duration.from({ seconds: idx }))
        await new Db()
          .db()
          .update(parkingSpotTable)
          .set({ createdAt: instant, updatedAt: instant })
          .where(eq(parkingSpotTable.id, parkingSpot.id))
        allSpots.push(required(await landlordChallengerClient.parkingSpots.get(parkingSpot.id)))
      }
    })

    describe('listClosestToPoint', () => {
      it('landlord should be able to list the parking spots closest to a given point', async () => {
        // There's 20 spots, but we're only going to get the 5 closest to a given point
        const location: Point = { longitude: 10, latitude: 10 }
        const fiveClosestSpots = allSpots.filter((spot) => [8, 9, 10, 11, 12].includes(spot.location.longitude))
        expect(fiveClosestSpots).toHaveLength(5) // Make sure we didn't screw up the test setup

        // Then get those 5 spots, verify they're the 5 closest
        const { data: foundSpots } = await landlordChallengerClient.parkingSpots.listClosestToPoint({
          longitude: location.longitude,
          latitude: location.latitude,
          limit: 5,
        })
        expect(orderBy(foundSpots, (spot) => spot.location.longitude)).toStrictEqual(fiveClosestSpots)
      })

      it('renter should be able to list the parking spots closest to a given point', async () => {
        // There's 20 spots, but we're only going to get the 5 closest to a given point
        const location: Point = { longitude: 10, latitude: 10 }
        const fiveClosestSpots = allSpots.filter((spot) => [8, 9, 10, 11, 12].includes(spot.location.longitude))
        expect(fiveClosestSpots).toHaveLength(5) // Make sure we didn't screw up the test setup

        // Then get those 5 spots, verify they're the 5 closest
        const { data: foundSpots } = await renterChallengerClient.parkingSpots.listClosestToPoint({
          longitude: location.longitude,
          latitude: location.latitude,
          limit: 5,
        })
        expect(orderBy(foundSpots, (spot) => spot.location.longitude)).toStrictEqual(fiveClosestSpots)
      })
    })

    describe('list', () => {
      it('paginates properly, in ascending order', async () => {
        const page1 = await landlordChallengerClient.parkingSpots.listPage({
          ownerUserId: landlordUserId,
          orderBy: 'createdAt',
          orderDirection: OrderDirectionValues.asc,
          limit: 7,
        })
        expect(page1.data).toHaveLength(7)
        expect(page1.data).toStrictEqual(allSpots.slice(0, 7))
        expect(page1.pagination.previous).toBeDefined()
        expect(page1.pagination.next).toBeDefined()

        const page2 = await landlordChallengerClient.parkingSpots.listPage({
          ownerUserId: landlordUserId,
          cursor: page1.pagination.next,
        })
        expect(page2.data).toHaveLength(7)
        expect(page2.data).toStrictEqual(allSpots.slice(7, 14))
        expect(page2.pagination.previous).toBeDefined()
        expect(page2.pagination.next).toBeDefined()

        const page3 = await landlordChallengerClient.parkingSpots.listPage({
          ownerUserId: landlordUserId,
          cursor: page2.pagination.next,
        })
        expect(page3.data).toHaveLength(6)
        expect(page3.data).toStrictEqual(allSpots.slice(14, 20))
        expect(page3.pagination.previous).toBeDefined()
        expect(page3.pagination.next).toBeDefined()

        const page4 = await landlordChallengerClient.parkingSpots.listPage({
          ownerUserId: landlordUserId,
          cursor: page3.pagination.next,
        })
        expect(page4.data).toHaveLength(0)
        expect(page4.pagination.previous).toBeUndefined()
        expect(page4.pagination.next).toBeUndefined()
      })

      it('paginates properly, in descending order', async () => {
        const page1 = await landlordChallengerClient.parkingSpots.listPage({
          ownerUserId: landlordUserId,
          orderBy: 'createdAt',
          orderDirection: OrderDirectionValues.desc,
          limit: 7,
        })
        expect(page1.data).toHaveLength(7)
        expect(page1.data).toStrictEqual(allSpots.slice(13, 20).reverse())
        expect(page1.pagination.previous).toBeDefined()
        expect(page1.pagination.next).toBeDefined()

        const page2 = await landlordChallengerClient.parkingSpots.listPage({
          ownerUserId: landlordUserId,
          cursor: page1.pagination.next,
        })
        expect(page2.data).toHaveLength(7)
        expect(page2.data).toStrictEqual(allSpots.slice(6, 13).reverse())
        expect(page2.pagination.previous).toBeDefined()
        expect(page2.pagination.next).toBeDefined()

        const page3 = await landlordChallengerClient.parkingSpots.listPage({
          ownerUserId: landlordUserId,
          cursor: page2.pagination.next,
        })
        expect(page3.data).toHaveLength(6)
        expect(page3.data).toStrictEqual(allSpots.slice(0, 6).reverse())
        expect(page3.pagination.previous).toBeDefined()
        expect(page3.pagination.next).toBeDefined()

        const page4 = await landlordChallengerClient.parkingSpots.listPage({
          ownerUserId: landlordUserId,
          cursor: page3.pagination.next,
        })
        expect(page4.data).toHaveLength(0)
        expect(page4.pagination.previous).toBeUndefined()
        expect(page4.pagination.next).toBeUndefined()
      })

      it('allows going "backwards" using the previous cursor', async () => {
        const page1 = await landlordChallengerClient.parkingSpots.listPage({
          ownerUserId: landlordUserId,
          orderBy: 'createdAt',
          orderDirection: OrderDirectionValues.asc,
          limit: 7,
        })

        const page2 = await landlordChallengerClient.parkingSpots.listPage({
          ownerUserId: landlordUserId,
          cursor: page1.pagination.next,
        })

        const page1Again = await landlordChallengerClient.parkingSpots.listPage({
          ownerUserId: landlordUserId,
          cursor: page2.pagination.previous,
        })

        expect(sortBy(page1Again.data, 'id')).toStrictEqual(sortBy(page1.data, 'id'))
      })

      it('lists all parking spots', async () => {
        const spots = await landlordChallengerClient.parkingSpots.listAllPages({
          ownerUserId: landlordUserId,
          orderBy: 'createdAt',
          orderDirection: OrderDirectionValues.asc,
          limit: 7,
        })
        expect(spots).toHaveLength(20)
        expect(spots).toStrictEqual(allSpots)
      })
    })
  })
})
