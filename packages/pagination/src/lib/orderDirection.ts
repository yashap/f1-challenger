import { z } from 'zod'

const orderDirection = ['asc', 'desc'] as const
export const OrderDirectionSchema = z.enum(orderDirection)
export type OrderDirection = z.infer<typeof OrderDirectionSchema>
export const OrderDirectionValues = OrderDirectionSchema.Enum
