import { LeagueStatusValues, contract as rootContract } from '@f1-challenger/challenger-client'
import { runQueryWithPagination } from '@f1-challenger/drizzle-utils'
import { ForbiddenError, required } from '@f1-challenger/errors'
import { BaseController, Endpoint, HandlerResult, HttpStatus, handler } from '@f1-challenger/nest-utils'
import { buildPaginatedResponse, parsePagination } from '@f1-challenger/pagination'
import { Controller, UseGuards } from '@nestjs/common'
import { and, eq } from 'drizzle-orm'
import { isEmpty } from 'lodash'
import { SessionContainer } from 'supertokens-node/recipe/session'
import { AuthGuard, Session } from 'src/auth'
import { Db } from 'src/db/Db'
import { leagueTable } from 'src/db/schema'
import { League, leagueToDto, ListLeaguePagination, parseLeagueOrdering } from 'src/domain/league/League'

const contract = rootContract.leagues

@Controller()
export class LeagueController extends BaseController {
  constructor(private readonly db: Db) {
    super('League')
  }

  @Endpoint(contract.list)
  @UseGuards(new AuthGuard())
  public list(@Session() _session: SessionContainer): HandlerResult<typeof contract.list> {
    return handler(contract.list, async ({ query }) => {
      const { adminUserId } = query
      const pagination: ListLeaguePagination = parsePagination(query, parseLeagueOrdering)
      const leagues = await runQueryWithPagination(pagination, leagueTable, ({ where, orderBy, limit }) => {
        return this.db.db().query.leagueTable.findMany({
          where: and(adminUserId ? eq(leagueTable.adminUserId, adminUserId) : undefined, where),
          orderBy,
          limit,
        })
      })
      return {
        status: HttpStatus.OK,
        body: buildPaginatedResponse(leagues.map(leagueToDto), pagination),
      }
    })
  }

  @Endpoint(contract.post)
  @UseGuards(new AuthGuard())
  public create(@Session() session: SessionContainer): HandlerResult<typeof contract.post> {
    return handler(contract.post, async ({ body }) => {
      const result = await this.db
        .db()
        .insert(leagueTable)
        .values({
          ...body,
          adminUserId: session.getUserId(),
          status: LeagueStatusValues.AcceptingUsers,
        })
        .returning()
      const league = required(result[0])
      return { status: HttpStatus.CREATED, body: leagueToDto(league) }
    })
  }

  @Endpoint(contract.get)
  @UseGuards(new AuthGuard())
  public getById(@Session() _session: SessionContainer): HandlerResult<typeof contract.get> {
    return handler(contract.get, async ({ params: { id } }) => {
      const maybeLeague = await this.db.db().query.leagueTable.findFirst({
        where: eq(leagueTable.id, id),
      })
      return { status: HttpStatus.OK, body: leagueToDto(this.getEntityOrNotFound(maybeLeague)) }
    })
  }

  @Endpoint(contract.patch)
  @UseGuards(new AuthGuard())
  public update(@Session() session: SessionContainer): HandlerResult<typeof contract.patch> {
    return handler(contract.patch, async ({ params: { id }, body }) => {
      const initialLeague = await this.getAndVerifyCanModify(id, session.getUserId())
      if (isEmpty(body)) {
        return { status: HttpStatus.OK, body: leagueToDto(initialLeague) }
      }

      await this.db.db().update(leagueTable).set(body).where(eq(leagueTable.id, id))
      const league = await this.db.db().query.leagueTable.findFirst({
        where: eq(leagueTable.id, id),
      })
      return { status: HttpStatus.OK, body: leagueToDto(required(league)) }
    })
  }

  @Endpoint(contract.delete)
  @UseGuards(new AuthGuard())
  public delete(@Session() session: SessionContainer): HandlerResult<typeof contract.delete> {
    return handler(contract.delete, async ({ params: { id } }) => {
      await this.getAndVerifyCanModify(id, session.getUserId())
      await this.db.db().delete(leagueTable).where(eq(leagueTable.id, id))
      return { status: HttpStatus.NO_CONTENT, body: undefined }
    })
  }

  private async getAndVerifyCanModify(leagueId: string, userIdPerformingAction: string): Promise<League> {
    const maybeLeague = await this.db.db().query.leagueTable.findFirst({
      where: eq(leagueTable.id, leagueId),
    })
    const league = this.getEntityOrNotFound(maybeLeague)
    if (league.adminUserId !== userIdPerformingAction) {
      throw new ForbiddenError('Forbidden as you are not the admin of this league')
    }
    return league
  }
}
