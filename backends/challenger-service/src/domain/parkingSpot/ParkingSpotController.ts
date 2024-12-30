import { contract as rootContract } from '@f1-challenger/challenger-client'
import { buildPaginationQuery } from '@f1-challenger/drizzle-utils'
import { ForbiddenError, required } from '@f1-challenger/errors'
import { BaseController, Endpoint, HandlerResult, HttpStatus, handler } from '@f1-challenger/nest-utils'
import { DEFAULT_LIMIT, buildPaginatedResponse, parsePagination } from '@f1-challenger/pagination'
import { Controller, UseGuards } from '@nestjs/common'
import { and, asc, eq, sql } from 'drizzle-orm'
import { isEmpty } from 'lodash'
import { SessionContainer } from 'supertokens-node/recipe/session'
import { AuthGuard, Session } from 'src/auth'
import { Db } from 'src/db/Db'
import { parkingSpotTable } from 'src/db/schema'
import {
  ListParkingSpotPagination,
  ParkingSpot,
  parkingSpotToDto,
  parseParkingSpotOrdering,
} from 'src/domain/parkingSpot/ParkingSpot'
import { TimeZoneLookup } from 'src/domain/time/TimeZoneLookup'

const contract = rootContract.parkingSpots

@Controller()
export class ParkingSpotController extends BaseController {
  constructor(private readonly db: Db) {
    super('ParkingSpot')
  }

  @Endpoint(contract.list)
  @UseGuards(new AuthGuard())
  public list(@Session() _session: SessionContainer): HandlerResult<typeof contract.list> {
    return handler(contract.list, async ({ query }) => {
      const { ownerUserId } = query
      const pagination: ListParkingSpotPagination = parsePagination(query, parseParkingSpotOrdering)
      const { where, orderBy, limit } = buildPaginationQuery(parkingSpotTable, pagination)
      const parkingSpots = await this.db.db().query.parkingSpotTable.findMany({
        where: and(ownerUserId ? eq(parkingSpotTable.ownerUserId, ownerUserId) : undefined, where),
        orderBy,
        limit,
      })
      return {
        status: HttpStatus.OK,
        body: buildPaginatedResponse(parkingSpots.map(parkingSpotToDto), pagination),
      }
    })
  }

  @Endpoint(contract.listClosestToPoint)
  @UseGuards(new AuthGuard())
  public listClosestToPoint(@Session() _session: SessionContainer): HandlerResult<typeof contract.listClosestToPoint> {
    return handler(contract.listClosestToPoint, async ({ query }) => {
      const { longitude, latitude, limit = DEFAULT_LIMIT } = query
      const parkingSpots = await this.db.db().query.parkingSpotTable.findMany({
        where: undefined,
        orderBy: asc(sql`${parkingSpotTable.location} <-> ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)`),
        limit,
      })
      return { status: HttpStatus.OK, body: { data: parkingSpots.map(parkingSpotToDto) } }
    })
  }

  @Endpoint(contract.post)
  @UseGuards(new AuthGuard())
  public create(@Session() session: SessionContainer): HandlerResult<typeof contract.post> {
    return handler(contract.post, async ({ body }) => {
      const result = await this.db
        .db()
        .insert(parkingSpotTable)
        .values({
          ...body,
          ownerUserId: session.getUserId(),
          timeZone: TimeZoneLookup.getTimeZoneForPoint(body.location),
        })
        .returning()
      const parkingSpot = required(result[0])
      return { status: HttpStatus.CREATED, body: parkingSpotToDto(parkingSpot) }
    })
  }

  @Endpoint(contract.get)
  @UseGuards(new AuthGuard())
  public getById(@Session() _session: SessionContainer): HandlerResult<typeof contract.get> {
    return handler(contract.get, async ({ params: { id } }) => {
      const maybeParkingSpot = await this.db.db().query.parkingSpotTable.findFirst({
        where: eq(parkingSpotTable.id, id),
      })
      return { status: HttpStatus.OK, body: parkingSpotToDto(this.getEntityOrNotFound(maybeParkingSpot)) }
    })
  }

  @Endpoint(contract.patch)
  @UseGuards(new AuthGuard())
  public update(@Session() session: SessionContainer): HandlerResult<typeof contract.patch> {
    return handler(contract.patch, async ({ params: { id }, body }) => {
      const initialParkingSpot = await this.getAndVerifyOwnership(id, session.getUserId())
      if (isEmpty(body)) {
        return { status: HttpStatus.OK, body: parkingSpotToDto(initialParkingSpot) }
      }

      await this.db
        .db()
        .update(parkingSpotTable)
        .set({
          ...body,
          ...(body.location && {
            timeZone: TimeZoneLookup.getTimeZoneForPoint(body.location),
          }),
        })
        .where(eq(parkingSpotTable.id, id))
      const parkingSpot = await this.db.db().query.parkingSpotTable.findFirst({
        where: eq(parkingSpotTable.id, id),
      })
      return { status: HttpStatus.OK, body: parkingSpotToDto(required(parkingSpot)) }
    })
  }

  @Endpoint(contract.delete)
  @UseGuards(new AuthGuard())
  public delete(@Session() session: SessionContainer): HandlerResult<typeof contract.delete> {
    return handler(contract.delete, async ({ params: { id } }) => {
      await this.getAndVerifyOwnership(id, session.getUserId())
      await this.db.db().delete(parkingSpotTable).where(eq(parkingSpotTable.id, id))
      return { status: HttpStatus.NO_CONTENT, body: undefined }
    })
  }

  private async getAndVerifyOwnership(parkingSpotId: string, userId: string): Promise<ParkingSpot> {
    const maybeParkingSpot = await this.db.db().query.parkingSpotTable.findFirst({
      where: eq(parkingSpotTable.id, parkingSpotId),
    })
    const parkingSpot = this.getEntityOrNotFound(maybeParkingSpot)
    if (parkingSpot.ownerUserId !== userId) {
      throw new ForbiddenError('Forbidden as you are not the owner of this parking spot')
    }
    return parkingSpot
  }
}
