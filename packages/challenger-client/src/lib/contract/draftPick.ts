import { ContractBuilder } from '@f1-challenger/api-client-utils'
import { initContract } from '@ts-rest/core'
import { z } from 'zod'
import {
  CreateDraftPickRequestSchema,
  ListDraftPickRequestSchema,
  ListDraftPickResponseSchema,
  DraftPickSchema,
  DeleteDraftPickRequestSchema,
} from '../model/DraftPick'

const c = initContract()

export const draftPickContract = c.router({
  list: {
    method: 'GET',
    path: '/draftPick',
    query: ListDraftPickRequestSchema,
    responses: ContractBuilder.buildListResponses(ListDraftPickResponseSchema),
    summary: 'List draft picks',
  },
  post: {
    method: 'POST',
    path: '/draftPick',
    body: CreateDraftPickRequestSchema,
    responses: ContractBuilder.buildPostResponses(DraftPickSchema),
    summary: 'Make a draft pick',
  },
  get: {
    method: 'GET',
    path: '/draftPick/:id',
    pathParams: z.object({
      id: z.string().uuid(),
    }),
    responses: ContractBuilder.buildGetResponses(DraftPickSchema),
    summary: 'Get a draft pick',
  },
  delete: {
    method: 'DELETE',
    path: '/draftPick',
    body: DeleteDraftPickRequestSchema,
    responses: ContractBuilder.buildDeleteResponses(),
    summary: 'Delete a draft pick',
  },
})
