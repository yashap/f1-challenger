import { z, ZodArray, ZodObject, ZodTypeAny } from 'zod'
import { DEFAULT_MAX_LIMIT } from './constants'
import { OrderDirectionSchema } from './orderDirection'

export const PaginationRequestSchema = z.object(
  {
    limit: z.coerce.number().min(1).max(DEFAULT_MAX_LIMIT).optional().describe('Number of items to fetch'),
    orderBy: z.string().optional().describe('Field to order by'),
    orderDirection: OrderDirectionSchema.optional().describe('Order direction'),
    cursor: z.string().optional().describe('Cursor containing all information necessary to fetch the next page'),
  },
  {
    description:
      'Pagination query params. For fetching the first page, pass any/all of limit/orderBy/orderDirection. For ' +
      'fetching subsequent pages, pass only the cursor you got from the previous response.',
  }
)

export type PaginationRequestDto = z.infer<typeof PaginationRequestSchema>

export const PaginationResponseSchema = z.object(
  {
    next: z.string().optional().describe('Can be used to fetch the next page'),
    previous: z.string().optional().describe('Can be used to fetch the previous page'),
  },
  { description: 'Pagination information, attached to responses of list endpoints, to allow you to fetch other pages' }
)

export type PaginationResponseDto = z.infer<typeof PaginationResponseSchema>

export type PaginatedResponseSchema<T extends ZodTypeAny> = ZodObject<{
  data: ZodArray<T>
  pagination: typeof PaginationResponseSchema
}>

export interface PaginatedResponseDto<T> {
  data: T[]
  pagination: PaginationResponseDto
}
