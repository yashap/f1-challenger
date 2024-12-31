import { ContractBuilder } from '@f1-challenger/api-client-utils'
import { initContract } from '@ts-rest/core'
import { z } from 'zod'
import {
  CreateLeagueRequestSchema,
  ListLeaguesRequestSchema,
  ListLeaguesResponseSchema,
  LeagueSchema,
  UpdateLeagueRequestSchema,
} from '../model/League'

const c = initContract()

export const leagueContract = c.router({
  list: {
    method: 'GET',
    path: '/leagues',
    query: ListLeaguesRequestSchema,
    responses: ContractBuilder.buildListResponses(ListLeaguesResponseSchema),
    summary: 'List leagues',
  },
  post: {
    method: 'POST',
    path: '/leagues',
    body: CreateLeagueRequestSchema,
    responses: ContractBuilder.buildPostResponses(LeagueSchema),
    summary: 'Create a league',
  },
  get: {
    method: 'GET',
    path: '/leagues/:id',
    pathParams: z.object({
      id: z.string().uuid(),
    }),
    responses: ContractBuilder.buildGetResponses(LeagueSchema),
    summary: 'Get a league',
  },
  patch: {
    method: 'PATCH',
    path: '/leagues/:id',
    pathParams: z.object({
      id: z.string().uuid(),
    }),
    body: UpdateLeagueRequestSchema,
    responses: ContractBuilder.buildPatchResponses(LeagueSchema),
    summary: 'Update a league',
  },
  delete: {
    method: 'DELETE',
    path: '/leagues/:id',
    pathParams: z.object({
      id: z.string().uuid(),
    }),
    body: z.NEVER,
    responses: ContractBuilder.buildDeleteResponses(),
    summary: 'Delete a league',
  },
})
