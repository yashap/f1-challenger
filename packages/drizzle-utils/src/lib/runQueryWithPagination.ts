import { Pagination, OrderDirectionValues, Cursor } from '@f1-challenger/pagination'
import { and, asc, desc, eq, gt, lt, or, SQL } from 'drizzle-orm'
import { PgColumn, PgTableWithColumns } from 'drizzle-orm/pg-core'

export interface QueryPagination {
  where?: SQL
  orderBy: SQL
  limit: number
}

/**
 * Run a database query to fetch a specific page of records from the database.
 *
 * @param pagination - Which page should be fetched from the DB
 * @param table - The definition of the table we're querying against
 * @param fetchPage - A function that will fetch the records from the DB, using a version of the pagination params that
 *                    have been converted to DB query params
 * @returns The specified page of records from the DB
 */
export const runQueryWithPagination = async <T, K extends string, V>(
  pagination: Pagination<K, V>,
  table: PgTableWithColumns<{
    name: string
    schema: string | undefined
    columns: Record<'id' | K, PgColumn>
    dialect: string
  }>,
  fetchPage: (pagination: QueryPagination) => Promise<T[]>
): Promise<T[]> => {
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

  const records = await fetchPage({ where, orderBy, limit })

  const initialOrderDirection = (pagination as Partial<Cursor<K, V>>).initialOrderDirection ?? pagination.orderDirection
  const orderIsInitialOrder = pagination.orderDirection === initialOrderDirection
  return orderIsInitialOrder ? records : [...records].reverse()
}
