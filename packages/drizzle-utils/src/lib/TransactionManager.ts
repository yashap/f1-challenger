import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core'
import { ActiveTransactionContext } from './ActiveTransactionContext'
import { DbConnection, DbTransaction } from './types'

export class TransactionManager<Schema extends Record<string, unknown>> {
  constructor(private readonly db: NodePgDatabase<Schema>) {}

  /**
   * Ensures that the code within the callback is run with a transaction in the context. If a transaction is already
   * running, this does nothing, while if no transaction is running, it will start a transaction, put it in the
   * propagated context, and then run the callback within said context. The idea is that you can write code that
   * naively runs against transactions, without having to pass a transaction around, or worry about whether or not any
   * of your child code is starting a "nested transaction" (starting a transaction within a transaction).
   *
   * If you're new to the magic of Context Propagation, see the README of @f1-challenger/context-propagation for details.
   *
   * Example Usage:
   *
   * ```ts
   * const users = pgTable('User', {
   *   id: integer().primaryKey().generatedAlwaysAsIdentity(),
   *   name: varchar({ length: 255 }).notNull(),
   * })
   *
   * const db = drizzle({ schema: { users } })
   *
   * const transactionManager = new TransactionManager(db)
   *
   * type User = typeof users.$inferSelect
   *
   * const createUser = async (name: string): Promise<User> => {
   *   const results = await transactionManager
   *     .getConnection()
   *     .insert(people)
   *     .values({ name: 'Alice' })
   *     .returning()
   *   return results[0]!
   * }
   *
   * // Here, the createUser calls run against a transaction
   * const { bob, anne } = await transactionManager.run(async () => {
   *   const bob = await createUser('Bob')
   *   const anne = await createUser('Anne')
   *   return { bob, anne }
   * })
   *
   * // Here, the create user call does not
   * const sam = await createUser('Sam')
   * ```
   */
  public async run<T>(callback: () => Promise<T>): Promise<T> {
    const maybeActiveTransaction = ActiveTransactionContext.getContext()
    if (maybeActiveTransaction) {
      return callback()
    }
    return this.db.transaction(async (trx) => {
      return ActiveTransactionContext.runWithContext(trx as PgTransaction<PgQueryResultHKT>, async () => {
        return callback()
      })
    })
  }

  /**
   * Returns either the active transaction, if there is one, else the base Drizzle DB connection instance.
   *
   * See the `run` method for more details.
   */
  public getConnection(): DbConnection<Schema> {
    const maybeActiveTransaction = ActiveTransactionContext.getContext() as DbTransaction<Schema> | undefined
    return maybeActiveTransaction ?? this.db
  }
}
