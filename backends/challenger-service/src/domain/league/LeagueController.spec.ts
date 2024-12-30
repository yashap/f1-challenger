import { SupertestInstance } from '@f1-challenger/api-client-test-utils'
import {
  ChallengerClient,
  CreateLeagueRequest,
  LeagueDto,
  LeagueStatusValues,
  UpdateLeagueRequest,
} from '@f1-challenger/challenger-client'
import { ForbiddenError, required } from '@f1-challenger/errors'
import { OrderDirectionValues } from '@f1-challenger/pagination'
import { Temporal } from '@js-temporal/polyfill'
import { INestApplication } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { omit, sortBy } from 'lodash'
import { v4 as uuid } from 'uuid'
import { AuthGuard } from 'src/auth'
import { Db } from 'src/db/Db'
import { leagueTable } from 'src/db/schema'
import { LeagueController } from 'src/domain/league/LeagueController'
import { buildTestApp } from 'src/test/buildTestApp'
import { expectSystemTimestampStrings } from 'src/test/expectSystemTimestamp'

describe(LeagueController.name, () => {
  let app: INestApplication
  let adminUserId: string
  let playerUserId: string
  let adminChallengerClient: ChallengerClient
  let playerChallengerClient: ChallengerClient

  beforeEach(async () => {
    adminUserId = uuid()
    playerUserId = uuid()

    app = await buildTestApp()
    adminChallengerClient = new ChallengerClient(
      new SupertestInstance(app.getHttpServer(), AuthGuard.buildTestAuthHeaders(adminUserId))
    )
    playerChallengerClient = new ChallengerClient(
      new SupertestInstance(app.getHttpServer(), AuthGuard.buildTestAuthHeaders(playerUserId))
    )
  })

  describe('Individual item endpoints', () => {
    let league: LeagueDto

    beforeEach(async () => {
      const leaguePostBody: CreateLeagueRequest = {
        name: 'Fancy League',
        description: 'A fancy F1 league',
      }
      league = await adminChallengerClient.leagues.create(leaguePostBody)
      const { id: leagueId, adminUserId, createdAt, updatedAt, ...otherLeagueData } = league
      expect(leagueId).toBeDefined()
      expect(adminUserId).toBe(adminUserId)
      expectSystemTimestampStrings({ createdAt, updatedAt })
      expect(otherLeagueData).toStrictEqual({ ...leaguePostBody, status: LeagueStatusValues.AcceptingUsers })
    })

    describe('getById', () => {
      it('admin should be able to get own parking spot by id', async () => {
        expect(await adminChallengerClient.leagues.get(league.id)).toStrictEqual(league)
      })

      it('player should be able to get parking spot by id', async () => {
        expect(await playerChallengerClient.leagues.get(league.id)).toStrictEqual(league)
      })

      it('should verify that a parking spot does not exist', async () => {
        expect(await adminChallengerClient.leagues.get(uuid())).toBeUndefined()
      })

      describe('update', () => {
        it('admin should be able to update a parking spot', async () => {
          const update: UpdateLeagueRequest = { name: 'Some new name' }
          expect(omit(await adminChallengerClient.leagues.update(league.id, update), ['updatedAt'])).toStrictEqual({
            ...omit(league, ['updatedAt']),
            ...update,
          })
        })

        it('player should not be able to update a parking spot', async () => {
          const update: UpdateLeagueRequest = { name: 'Some new name' }
          await expect(playerChallengerClient.leagues.update(league.id, update)).rejects.toThrow(ForbiddenError)

          // And assert it wasn't modified
          expect(await playerChallengerClient.leagues.get(league.id)).toStrictEqual(league)
        })
      })

      describe('delete', () => {
        it('admin should be able to delete a parking spot', async () => {
          expect(await adminChallengerClient.leagues.get(league.id)).toBeDefined()
          await adminChallengerClient.leagues.delete(league.id)

          // And assert it's deleted
          expect(await adminChallengerClient.leagues.get(league.id)).toBeUndefined()
        })

        it('player should not be able to delete a parking spot', async () => {
          expect(await playerChallengerClient.leagues.get(league.id)).toBeDefined()
          await expect(playerChallengerClient.leagues.delete(league.id)).rejects.toThrow(ForbiddenError)

          // And assert it's not deleted
          expect(await playerChallengerClient.leagues.get(league.id)).toBeDefined()
        })
      })
    })
  })

  describe('List endpoints', () => {
    let allSpots: LeagueDto[] = []
    const now: Temporal.Instant = Temporal.Now.instant()

    beforeEach(async () => {
      allSpots = []
      for (let idx = 0; idx < 20; idx++) {
        const league = await adminChallengerClient.leagues.create({
          name: `Fancy League ${idx}`,
          description: `Fancy F1 league number ${idx}`,
        })
        // Different createdAt for easy to test ordering
        const instant = now.add(Temporal.Duration.from({ seconds: idx }))
        await new Db()
          .db()
          .update(leagueTable)
          .set({ createdAt: instant, updatedAt: instant })
          .where(eq(leagueTable.id, league.id))
        allSpots.push(required(await adminChallengerClient.leagues.get(league.id)))
      }
    })

    describe('list', () => {
      it('paginates properly, in ascending order', async () => {
        const page1 = await adminChallengerClient.leagues.listPage({
          adminUserId,
          orderBy: 'createdAt',
          orderDirection: OrderDirectionValues.asc,
          limit: 7,
        })
        expect(page1.data).toHaveLength(7)
        expect(page1.data).toStrictEqual(allSpots.slice(0, 7))
        expect(page1.pagination.previous).toBeDefined()
        expect(page1.pagination.next).toBeDefined()

        const page2 = await adminChallengerClient.leagues.listPage({
          adminUserId,
          cursor: page1.pagination.next,
        })
        expect(page2.data).toHaveLength(7)
        expect(page2.data).toStrictEqual(allSpots.slice(7, 14))
        expect(page2.pagination.previous).toBeDefined()
        expect(page2.pagination.next).toBeDefined()

        const page3 = await adminChallengerClient.leagues.listPage({
          adminUserId,
          cursor: page2.pagination.next,
        })
        expect(page3.data).toHaveLength(6)
        expect(page3.data).toStrictEqual(allSpots.slice(14, 20))
        expect(page3.pagination.previous).toBeDefined()
        expect(page3.pagination.next).toBeDefined()

        const page4 = await adminChallengerClient.leagues.listPage({
          adminUserId,
          cursor: page3.pagination.next,
        })
        expect(page4.data).toHaveLength(0)
        expect(page4.pagination.previous).toBeUndefined()
        expect(page4.pagination.next).toBeUndefined()
      })

      it('paginates properly, in descending order', async () => {
        const page1 = await adminChallengerClient.leagues.listPage({
          adminUserId,
          orderBy: 'createdAt',
          orderDirection: OrderDirectionValues.desc,
          limit: 7,
        })
        expect(page1.data).toHaveLength(7)
        expect(page1.data).toStrictEqual(allSpots.slice(13, 20).reverse())
        expect(page1.pagination.previous).toBeDefined()
        expect(page1.pagination.next).toBeDefined()

        const page2 = await adminChallengerClient.leagues.listPage({
          adminUserId,
          cursor: page1.pagination.next,
        })
        expect(page2.data).toHaveLength(7)
        expect(page2.data).toStrictEqual(allSpots.slice(6, 13).reverse())
        expect(page2.pagination.previous).toBeDefined()
        expect(page2.pagination.next).toBeDefined()

        const page3 = await adminChallengerClient.leagues.listPage({
          adminUserId,
          cursor: page2.pagination.next,
        })
        expect(page3.data).toHaveLength(6)
        expect(page3.data).toStrictEqual(allSpots.slice(0, 6).reverse())
        expect(page3.pagination.previous).toBeDefined()
        expect(page3.pagination.next).toBeDefined()

        const page4 = await adminChallengerClient.leagues.listPage({
          adminUserId,
          cursor: page3.pagination.next,
        })
        expect(page4.data).toHaveLength(0)
        expect(page4.pagination.previous).toBeUndefined()
        expect(page4.pagination.next).toBeUndefined()
      })

      it('allows going "backwards" using the previous cursor', async () => {
        const page1 = await adminChallengerClient.leagues.listPage({
          adminUserId,
          orderBy: 'createdAt',
          orderDirection: OrderDirectionValues.asc,
          limit: 7,
        })

        const page2 = await adminChallengerClient.leagues.listPage({
          adminUserId,
          cursor: page1.pagination.next,
        })

        const page1Again = await adminChallengerClient.leagues.listPage({
          adminUserId,
          cursor: page2.pagination.previous,
        })

        expect(sortBy(page1Again.data, 'id')).toStrictEqual(sortBy(page1.data, 'id'))
      })

      it('lists all parking spots', async () => {
        const spots = await adminChallengerClient.leagues.listAllPages({
          adminUserId,
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
