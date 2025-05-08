import { ContractBuilder } from '@f1-challenger/api-client-utils'
import { initContract } from '@ts-rest/core'
import { z } from 'zod'
import {
  ListDriverRequestSchema,
  ListDriverResponseSchema,
  DriverSchema,
} from '../model/Driver'

const c = initContract()

export const driverContract = c.router({
  list: {
    method: 'GET',
    path: '/driver',
    query: ListDriverRequestSchema,
    responses: ContractBuilder.buildListResponses(ListDriverResponseSchema),
    summary: 'List Drivers',
  },
  get: {
    method: 'GET',
    path: '/driver/:id',
    pathParams: z.object({
      id: z.string().uuid(),
    }),
    responses: ContractBuilder.buildGetResponses(DriverSchema),
    summary: 'Get driver',
  }
})
