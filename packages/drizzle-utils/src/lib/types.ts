import { ExtractTablesWithRelations } from 'drizzle-orm'
import { NodePgDatabase, NodePgQueryResultHKT } from 'drizzle-orm/node-postgres'
import { PgTransaction } from 'drizzle-orm/pg-core'

export type DbTransaction<Schema extends Record<string, unknown>> = PgTransaction<
  NodePgQueryResultHKT,
  Schema,
  ExtractTablesWithRelations<Schema>
>

export type DbConnection<Schema extends Record<string, unknown>> = DbTransaction<Schema> | NodePgDatabase<Schema>
