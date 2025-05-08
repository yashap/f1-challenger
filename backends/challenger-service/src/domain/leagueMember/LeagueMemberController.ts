import { contract as rootContract } from '@f1-challenger/challenger-client'
import { buildPaginationQuery } from '@f1-challenger/drizzle-utils'
import { ForbiddenError, required } from '@f1-challenger/errors'
import { BaseController, Endpoint, HandlerResult, HttpStatus, handler } from '@f1-challenger/nest-utils'
import { buildPaginatedResponse, parsePagination } from '@f1-challenger/pagination'
import { Controller, UseGuards } from '@nestjs/common'
import { and, eq } from 'drizzle-orm'
import { SessionContainer } from 'supertokens-node/recipe/session'
import { AuthGuard, Session } from 'src/auth'
import { Db } from 'src/db/Db'
import { leagueMemberTable, leagueTable } from 'src/db/schema'
import {
  LeagueMember,
  leagueMemberToDto,
  ListLeagueMemberPagination,
  parseLeagueMemberOrdering,
} from 'src/domain/leagueMember/LeagueMember'

const contract = rootContract.leagueMember

@Controller()
export class LeagueMemberController extends BaseController {
  constructor(private readonly db: Db) {
    super('LeagueMember')
  }

  @Endpoint(contract.list)
  @UseGuards(new AuthGuard())
  public list(@Session() _session: SessionContainer): HandlerResult<typeof contract.list> {
    return handler(contract.list, async ({ query }) => {
      const { userId, leagueId } = query
      const pagination: ListLeagueMemberPagination = parsePagination(query, parseLeagueMemberOrdering)
      const { where, orderBy, limit } = buildPaginationQuery(leagueMemberTable, pagination)
      const leagueMember = await this.db.db().query.leagueMemberTable.findMany({
        where: and(
          leagueId ? eq(leagueMemberTable.leagueId, leagueId) : undefined,
          and(userId ? eq(leagueMemberTable.userId, userId) : undefined),
          where
        ),
        orderBy,
        limit,
      })
      return {
        status: HttpStatus.OK,
        body: buildPaginatedResponse(leagueMember.map(leagueMemberToDto), pagination),
      }
    })
  }

  @Endpoint(contract.post)
  @UseGuards(new AuthGuard())
  public create(@Session() session: SessionContainer): HandlerResult<typeof contract.post> {
    return handler(contract.post, async ({ body }) => {
      const result = await this.db
        .db()
        .insert(leagueMemberTable)
        .values({
          ...body,
          userId: session.getUserId(),
        })
        .returning()
      const leagueMember = required(result[0])
      return { status: HttpStatus.CREATED, body: leagueMemberToDto(leagueMember) }
    })
  }

  @Endpoint(contract.get)
  @UseGuards(new AuthGuard())
  public getById(@Session() _session: SessionContainer): HandlerResult<typeof contract.get> {
    return handler(contract.get, async ({ params: { id } }) => {
      const maybeLeagueMember = await this.db.db().query.leagueMemberTable.findFirst({
        where: eq(leagueMemberTable.id, id),
      })
      return { status: HttpStatus.OK, body: leagueMemberToDto(this.getEntityOrNotFound(maybeLeagueMember)) }
    })
  }


  @Endpoint(contract.delete)
  @UseGuards(new AuthGuard())
  public delete(@Session() session: SessionContainer): HandlerResult<typeof contract.delete> {
    return handler(contract.delete, async ({ body }) => {
      const leagueMember = await this.getAndVerifyOwnership(body.leagueId, body.userId, session.getUserId())
      await this.db.db().delete(leagueMemberTable).where(eq(leagueMemberTable.id, leagueMember.id))
      return { status: HttpStatus.NO_CONTENT, body: undefined }
    })
  }

  private async getAndVerifyOwnership(
    leagueId: string,
    userId: string,
    userPerformingAction: string
  ): Promise<LeagueMember> {
    const maybeLeague = await this.db.db().query.leagueTable.findFirst({
      where: eq(leagueTable.id, leagueId),
    })
    const maybeLeagueMember = await this.db.db().query.leagueMemberTable.findFirst({
      where: and(eq(leagueMemberTable.leagueId, leagueId), eq(leagueMemberTable.userId, userId)),
    })
    const league = this.getEntityOrNotFound(maybeLeague)
    const leagueMember = this.getEntityOrNotFound(maybeLeagueMember)
    const isAdmin = league.adminUserId === userPerformingAction
    const isActingOnSelf = userId !== userPerformingAction
    if (!isAdmin && !isActingOnSelf) {
      throw new ForbiddenError('Forbidden as non-admin members cannot modify any other members but yourself.')
    }
    return leagueMember
  }
}