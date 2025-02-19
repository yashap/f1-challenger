import { contract as rootContract } from '@f1-challenger/challenger-client'
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
import { teamTable, leagueTable } from 'src/db/schema'
import { Team, teamToDto, ListTeamPagination, parseTeamOrdering } from 'src/domain/team/Team'

const contract = rootContract.teams

@Controller()
export class TeamController extends BaseController {
  constructor(private readonly db: Db) {
    super('Team')
  }

  @Endpoint(contract.list)
  @UseGuards(new AuthGuard())
  public list(@Session() _session: SessionContainer): HandlerResult<typeof contract.list> {
    return handler(contract.list, async ({ query }) => {
      const { userId, leagueId } = query
      const pagination: ListTeamPagination = parsePagination(query, parseTeamOrdering)
      const teams = await runQueryWithPagination(pagination, teamTable, ({ where, orderBy, limit }) => {
        return this.db.db().query.teamTable.findMany({
          where: and(
            leagueId ? eq(teamTable.leagueId, leagueId) : undefined,
            and(userId ? eq(teamTable.userId, userId) : undefined),
            where
          ),
          orderBy,
          limit,
        })
      })
      return {
        status: HttpStatus.OK,
        body: buildPaginatedResponse(teams.map(teamToDto), pagination),
      }
    })
  }

  @Endpoint(contract.post)
  @UseGuards(new AuthGuard())
  public create(@Session() session: SessionContainer): HandlerResult<typeof contract.post> {
    return handler(contract.post, async ({ body }) => {
      const result = await this.db
        .db()
        .insert(teamTable)
        .values({
          ...body,
          userId: session.getUserId(),
        })
        .returning()
      const team = required(result[0])
      return { status: HttpStatus.CREATED, body: teamToDto(team) }
    })
  }

  @Endpoint(contract.get)
  @UseGuards(new AuthGuard())
  public getById(@Session() _session: SessionContainer): HandlerResult<typeof contract.get> {
    return handler(contract.get, async ({ params: { id } }) => {
      const maybeTeam = await this.db.db().query.teamTable.findFirst({
        where: eq(teamTable.id, id),
      })
      return { status: HttpStatus.OK, body: teamToDto(this.getEntityOrNotFound(maybeTeam)) }
    })
  }

  @Endpoint(contract.patch)
  @UseGuards(new AuthGuard())
  public update(@Session() session: SessionContainer): HandlerResult<typeof contract.patch> {
    return handler(contract.patch, async ({ params: { id }, body }) => {
      const initialTeam = await this.getAndVerifyCanModify(id, session.getUserId())
      if (isEmpty(body)) {
        return { status: HttpStatus.OK, body: teamToDto(initialTeam) }
      }

      await this.db.db().update(teamTable).set(body).where(eq(teamTable.id, id))
      const team = await this.db.db().query.teamTable.findFirst({
        where: eq(teamTable.id, id),
      })
      return { status: HttpStatus.OK, body: teamToDto(required(team)) }
    })
  }

  @Endpoint(contract.delete)
  @UseGuards(new AuthGuard())
  public delete(@Session() session: SessionContainer): HandlerResult<typeof contract.delete> {
    return handler(contract.delete, async ({ params: { id } }) => {
      const team = await this.getAndVerifyCanModify(id, session.getUserId())
      await this.db.db().delete(teamTable).where(eq(teamTable.id, team.id))
      return { status: HttpStatus.NO_CONTENT, body: undefined }
    })
  }

  private async getAndVerifyCanModify(teamId: string, userIdPerformingAction: string): Promise<Team> {
    const team = this.getEntityOrNotFound(
      await this.db.db().query.teamTable.findFirst({
        where: eq(teamTable.id, teamId),
      })
    )
    const league = this.getEntityOrNotFound(
      await this.db.db().query.leagueTable.findFirst({
        where: eq(leagueTable.id, team.leagueId),
      })
    )
    const isLeagueAdmin = league.adminUserId === userIdPerformingAction
    const isActingOnSelf = team.userId === userIdPerformingAction
    if (!isLeagueAdmin && !isActingOnSelf) {
      throw new ForbiddenError('Forbidden as non-admin members cannot modify any other members but yourself.')
    }
    return team
  }
}
