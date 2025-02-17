import { ContractBuilder } from '@f1-challenger/api-client-utils'
import { initContract } from '@ts-rest/core'
import { z } from 'zod'
import {
  CreateTeamRequestSchema,
  ListTeamRequestSchema,
  ListTeamResponseSchema,
  TeamSchema,
  DeleteTeamRequestSchema,
} from '../model/Team'

const c = initContract()

export const teamContract = c.router({
  list: {
    method: 'GET',
    path: '/teams',
    query: ListTeamRequestSchema,
    responses: ContractBuilder.buildListResponses(ListTeamResponseSchema),
    summary: 'List teams',
  },
  post: {
    method: 'POST',
    path: '/teams',
    body: CreateTeamRequestSchema,
    responses: ContractBuilder.buildPostResponses(TeamSchema),
    summary: 'Join a league',
  },
  get: {
    method: 'GET',
    path: '/teams/:id',
    pathParams: z.object({
      id: z.string().uuid(),
    }),
    responses: ContractBuilder.buildGetResponses(TeamSchema),
    summary: 'Get teams',
  },
  delete: {
    method: 'DELETE',
    path: '/teams',
    body: DeleteTeamRequestSchema,
    responses: ContractBuilder.buildDeleteResponses(),
    summary: 'Delete team',
  },
})
