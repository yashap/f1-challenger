import { Db } from 'src/db/Db'
import { parkingSpotTable } from 'src/db/schema'

// Don't need to explicitly list tables with foreign key ON DELETE CASCADE
const tablesToDestroy = [parkingSpotTable]

export class TestDbTeardown {
  public async clear(): Promise<void> {
    const db = new Db()
    for (const table of tablesToDestroy) {
      await db.db().delete(table)
    }
  }
}
