import { ContractBuilder } from '@f1-challenger/api-client-utils'
import { initContract } from '@ts-rest/core'
import { z } from 'zod'
import {  ListRaceRequestSchema,
  ListRaceResponseSchema,
  RaceSchema,
} from '../model/Race'

const c = initContract()



export const raceContract = c.router({
  
  list: {
    method: 'GET',
    path: '/races',
    query: ListRaceRequestSchema,
    responses: ContractBuilder.buildListResponses(ListRaceResponseSchema),
    summary: 'List races',
  },
    get: {
      method: 'GET',
      path: '/driver/:id',
      pathParams: z.object({
        id: z.string().uuid(),
      }),
      responses: ContractBuilder.buildGetResponses(RaceSchema),
      summary: 'Get driver',
    }
})
