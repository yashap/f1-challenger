import { DbConnection, TransactionManager } from '@f1-challenger/drizzle-utils'
import { required } from '@f1-challenger/errors'
import { Injectable } from '@nestjs/common'
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as schema from 'src/db/schema'

export type DatabaseSchema = typeof schema

@Injectable()
export class Db {
  // Ensure just one DB connection for the app
  private static dbSingleton: NodePgDatabase<DatabaseSchema> = drizzle({
    schema,
    casing: 'camelCase',
    connection: {
      connectionString: required(process.env['DATABASE_URL']),
    },
  })

  private static transactionManager = new TransactionManager<DatabaseSchema>(Db.dbSingleton)

  public db(): DbConnection<DatabaseSchema> {
    return Db.transactionManager.getConnection()
  }

  public runWithTransaction<T>(callback: () => Promise<T>): Promise<T> {
    return Db.transactionManager.run(callback)
  }
}
