import { PaginationResponseSchema, PaginatedResponseSchema } from '@f1-challenger/pagination'
import { z, ZodTypeAny } from 'zod'

export class SchemaBuilder {
  public static buildListResponse<T extends ZodTypeAny>(itemSchema: T): PaginatedResponseSchema<T> {
    return z.object({
      data: z.array(itemSchema),
      pagination: PaginationResponseSchema,
    })
  }
}
