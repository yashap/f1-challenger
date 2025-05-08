import { ContractBuilder } from '@f1-challenger/api-client-utils'
import { initContract } from '@ts-rest/core'
import { z } from 'zod'
import {
  CreateDraftRequestSchema,
  ListDraftRequestSchema,
  ListDraftResponseSchema,
  DraftSchema,
  DeleteDraftRequestSchema,
} from '../model/Draft'

const c = initContract()

export const draftContract = c.router({
  list: {
    method: 'GET',
    path: '/draft',
    query: ListDraftRequestSchema,
    responses: ContractBuilder.buildListResponses(ListDraftResponseSchema),
    summary: 'List drafts',
  },
  post: {
    method: 'POST',
    path: '/draft',
    body: CreateDraftRequestSchema,
    responses: ContractBuilder.buildPostResponses(DraftSchema),
    summary: 'Start a draft',
  },
  get: {
    method: 'GET',
    path: '/draft/:id',
    pathParams: z.object({
      id: z.string().uuid(),
    }),
    responses: ContractBuilder.buildGetResponses(DraftSchema),
    summary: 'Get draft',
  },
  delete: {
    method: 'DELETE',
    path: '/draft',
    body: DeleteDraftRequestSchema,
    responses: ContractBuilder.buildDeleteResponses(),
    summary: 'Delete draft',
  },
})
