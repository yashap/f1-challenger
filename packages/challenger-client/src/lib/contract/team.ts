import { ContractBuilder } from '@f1-challenger/api-client-utils'
import { initContract } from '@ts-rest/core'
import { z } from 'zod'
import {
  CreateTeamRequestSchema,
  ListTeamRequestSchema,
  ListTeamResponseSchema,
  TeamSchema,
  UpdateTeamRequestSchema,
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
  patch: {
    method: 'PATCH',
    path: '/teams/:id',
    pathParams: z.object({
      id: z.string().uuid(),
    }),
    body: UpdateTeamRequestSchema,
    responses: ContractBuilder.buildPatchResponses(TeamSchema),
    summary: 'Update a team',
  },
  delete: {
    method: 'DELETE',
    path: '/teams/:id',
    pathParams: z.object({
      id: z.string().uuid(),
    }),
    body: z.NEVER,
    responses: ContractBuilder.buildDeleteResponses(),
    summary: 'Delete a team',
  },
})
