import { relations } from 'drizzle-orm'
import { pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { instant } from '../lib/instant'
import { plainTime } from '../lib/plainTime'
import { point } from '../lib/point'
import { standardFields } from '../lib/standardFields'

export const userTable = pgTable('User', {
  ...standardFields,
  name: text().notNull(),
})

export const userRelations = relations(userTable, ({ many }) => ({
  posts: many(postTable),
  favouriteLocations: many(favouriteLocationTable),
}))

export const postTable = pgTable('Post', {
  ...standardFields,
  authorId: uuid()
    .references(() => userTable.id, { onDelete: 'cascade', onUpdate: 'cascade' })
    .notNull(),
  message: text().notNull(),
  sentAt: instant().notNull(),
})

export const postRelations = relations(postTable, ({ one }) => ({
  author: one(userTable, {
    fields: [postTable.authorId],
    references: [userTable.id],
  }),
}))

export const favouriteLocationTable = pgTable('FavouriteLocation', {
  ...standardFields,
  userId: uuid()
    .references(() => userTable.id, { onDelete: 'cascade', onUpdate: 'cascade' })
    .notNull(),
  name: text().notNull(),
  location: point().notNull(),
})

export const favouriteLocationRelations = relations(favouriteLocationTable, ({ one }) => ({
  user: one(userTable, {
    fields: [favouriteLocationTable.userId],
    references: [userTable.id],
  }),
}))

export const reminderTable = pgTable('Reminder', {
  ...standardFields,
  userId: uuid()
    .references(() => userTable.id, { onDelete: 'cascade', onUpdate: 'cascade' })
    .notNull(),
  description: text().notNull(),
  time: plainTime().notNull(),
})

export const remindersRelations = relations(reminderTable, ({ one }) => ({
  user: one(userTable, {
    fields: [reminderTable.userId],
    references: [userTable.id],
  }),
}))
