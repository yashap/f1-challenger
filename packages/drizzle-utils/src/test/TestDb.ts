import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from '../test/testSchema'

export type TestDbSchema = typeof schema

export type User = typeof schema.userTable.$inferSelect
export type UserInput = typeof schema.userTable.$inferInsert

export type Post = typeof schema.postTable.$inferSelect
export type PostInput = typeof schema.postTable.$inferInsert

export type FavouriteLocation = typeof schema.favouriteLocationTable.$inferSelect
export type FavouriteLocationInput = typeof schema.favouriteLocationTable.$inferInsert

export type Reminder = typeof schema.reminderTable.$inferSelect
export type ReminderInput = typeof schema.reminderTable.$inferInsert

export class TestDb {
  private static dbSingleton: NodePgDatabase<TestDbSchema> | undefined = undefined

  public static async init() {
    const dbUrl = process.env['DATABASE_URL']
    if (!dbUrl) {
      throw new Error('DATABASE_URL is not set')
    }
    this.dbSingleton = drizzle(
      new Pool({
        connectionString: dbUrl,
      }),
      {
        schema,
      }
    )
  }

  public static db(): NodePgDatabase<TestDbSchema> {
    const db = this.dbSingleton
    if (!db) {
      throw new Error('TestDB not initialized (must call init before using)')
    }
    return db
  }

  public static async clear(): Promise<void> {
    await this.db().delete(schema.userTable)
  }
}
