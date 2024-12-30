import { ContractBuilder } from '@f1-challenger/api-client-utils'
import { initContract } from '@ts-rest/core'
import { z } from 'zod'
import {
  CreateLeagueMembersRequestSchema,
  ListLeagueMembersRequestSchema,
  ListLeagueMembersResponseSchema,
  LeagueMembersSchema,
} from '../model/LeagueMembers'

const c = initContract()

export const leagueMembersContract = c.router({
  list: {
    method: 'GET',
    path: '/leagues',
    query: ListLeagueMembersRequestSchema,
    responses: ContractBuilder.buildListResponses(ListLeagueMembersResponseSchema),
    summary: 'List leagues members',
  },
  post: {
    method: 'POST',
    path: '/leagues',
    body: CreateLeagueMembersRequestSchema,
    responses: ContractBuilder.buildPostResponses(LeagueMembersSchema),
    summary: 'Join a league',
  },
  get: {
    method: 'GET',
    path: '/leagues/:id',
    pathParams: z.object({
      id: z.string().uuid(),
    }),
    responses: ContractBuilder.buildGetResponses(LeagueMembersSchema),
    summary: 'Get league members',
  },
  delete: {
    method: 'DELETE',
    path: '/leagues/:id',
    pathParams: z.object({
      id: z.string().uuid(),
    }),
    body: z.NEVER,
    responses: ContractBuilder.buildDeleteResponses(),
    summary: 'Delete league members',
  },
})
