import { ContractBuilder } from '@f1-challenger/api-client-utils'
import { initContract } from '@ts-rest/core'
import { z } from 'zod'
import {
  CreateLeagueMemberRequestSchema,
  ListLeagueMemberRequestSchema,
  ListLeagueMemberResponseSchema,
  LeagueMemberSchema,
  DeleteLeagueMemberRequestSchema,
} from '../model/LeagueMember'

const c = initContract()

export const leagueMemberContract = c.router({
  list: {
    method: 'GET',
    path: '/leagueMembers',
    query: ListLeagueMemberRequestSchema,
    responses: ContractBuilder.buildListResponses(ListLeagueMemberResponseSchema),
    summary: 'List leagues members',
  },
  post: {
    method: 'POST',
    path: '/leagueMembers',
    body: CreateLeagueMemberRequestSchema,
    responses: ContractBuilder.buildPostResponses(LeagueMemberSchema),
    summary: 'Join a league',
  },
  get: {
    method: 'GET',
    path: '/leagueMembers/:id',
    pathParams: z.object({
      id: z.string().uuid(),
    }),
    responses: ContractBuilder.buildGetResponses(LeagueMemberSchema),
    summary: 'Get league members',
  },
  delete: {
    method: 'DELETE',
    path: '/leagueMembers',
    body: DeleteLeagueMemberRequestSchema,
    responses: ContractBuilder.buildDeleteResponses(),
    summary: 'Delete league members',
  },
})
