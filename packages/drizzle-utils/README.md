# @f1-challenger/drizzle-utils

A small library to make working with [Drizzle](https://orm.drizzle.team/) easier.

## Example Use Case

```ts
const users = pgTable('User', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
})

const db = drizzle({ schema: { users } })

const transactionManager = new TransactionManager(db)

type User = typeof users.$inferSelect

const createUser = async (name: string): Promise<User> => {
  const results = await transactionManager.getConnection().insert(people).values({ name: 'Alice' }).returning()
  return results[0]!
}

// Here, the createUser calls run against a transaction
const { bob, anne } = await transactionManager.run(async () => {
  const bob = await createUser('Bob')
  const anne = await createUser('Anne')
  return { bob, anne }
})

// Here, the create user call does not
const sam = await createUser('Sam')
```
