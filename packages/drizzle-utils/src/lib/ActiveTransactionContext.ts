import { ContextPropagator } from '@f1-challenger/context-propagation'
import { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core'

export const ActiveTransactionContext = new ContextPropagator<PgTransaction<PgQueryResultHKT>>()
