import { Pagination, OrderDirectionValues, Cursor } from '@f1-challenger/pagination'
import { and, asc, desc, eq, gt, lt, or, SQL } from 'drizzle-orm'
import { PgColumn, PgTableWithColumns } from 'drizzle-orm/pg-core'

export const buildPaginationQuery = <K extends string, V>(
  table: PgTableWithColumns<{
    name: string
    schema: string | undefined
    columns: Record<'id' | K, PgColumn>
    dialect: string
  }>,
  pagination?: Pagination<K> | Cursor<K, V>
): {
  where?: SQL
  orderBy?: SQL
  limit?: number
} => {
  if (!pagination) {
    return {}
  }

  const limit = pagination.limit
  const direction = pagination.orderDirection === OrderDirectionValues.asc ? asc : desc
  const field = table[pagination.orderBy]
  const orderBy = direction(field)

  let where: SQL | undefined = undefined
  const lastOrderValueSeen = (pagination as Partial<Cursor<K, V>>).lastOrderValueSeen
  const lastIdSeen = (pagination as Partial<Cursor<K, V>>).lastIdSeen
  if (lastOrderValueSeen && lastIdSeen) {
    const inequality = pagination.orderDirection === OrderDirectionValues.desc ? lt : gt
    where = or(
      and(eq(field, lastOrderValueSeen), inequality(table.id, lastIdSeen)),
      inequality(field, lastOrderValueSeen)
    )
  }

  return {
    where,
    orderBy,
    limit,
  }
}
