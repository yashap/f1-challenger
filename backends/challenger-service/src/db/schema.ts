import { point, standardFields } from '@f1-challenger/drizzle-utils'
import { uuid, pgTable, text, index } from 'drizzle-orm/pg-core'

export const parkingSpotTable = pgTable(
  'ParkingSpot',
  {
    ...standardFields,
    ownerUserId: uuid().notNull(),
    address: text().notNull(),
    location: point().notNull(),
    timeZone: text().notNull(),
  },
  (table) => [
    index('ParkingSpot_ownerUserId_idx').on(table.ownerUserId),
    index('ParkingSpot_location_idx').using('gist', table.location),
  ]
)

// export const parkingSpotRelations = relations(parkingSpotTable, ({ many }) => ({
//   bookings: many(parkingSpotBookingTable),
//   timeRules: many(timeRuleTable),
//   timeRuleOverrides: many(timeRuleOverrideTable),
// }))

// export const parkingSpotBookingTable = pgTable(
//   'ParkingSpotBooking',
//   {
//     ...standardFields,
//     parkingSpotId: uuid()
//       .notNull()
//       .references(() => parkingSpotTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
//     bookedByUserId: uuid().notNull(),
//     bookingStartsAt: instant().notNull(),
//     bookingEndsAt: instant(),
//     status: text({ enum: BookingStatusAllValues })
//       .notNull()
//       .references(() => _values_parkingSpotBookingStatus.status),
//   },
//   (table) => [
//     index('ParkingSpotBooking_bookedByUserId_idx').on(table.bookedByUserId),
//     index('ParkingSpotBooking_parkingSpotId_idx').on(table.parkingSpotId),
//   ]
// )

// export const parkingSpotBookingsRelations = relations(parkingSpotBookingTable, ({ one }) => ({
//   parkingSpot: one(parkingSpotTable, {
//     fields: [parkingSpotBookingTable.parkingSpotId],
//     references: [parkingSpotTable.id],
//   }),
// }))

// // Accepted, Cancelled, InProgress
// export const _values_parkingSpotBookingStatus = pgTable('values_ParkingSpotBooking_status', {
//   status: text().primaryKey(),
// })

// export const timeRuleTable = pgTable(
//   'TimeRule',
//   {
//     ...standardFields,
//     parkingSpotId: uuid()
//       .notNull()
//       .references(() => parkingSpotTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
//     day: text({ enum: DayOfWeekAllValues })
//       .notNull()
//       .references(() => _values_timeRuleDay.day),
//     startTime: plainTime().notNull(),
//     endTime: plainTime().notNull(),
//   },
//   (table) => [index('TimeRule_parkingSpotId_idx').on(table.parkingSpotId)]
// )

// export const timeRuleRelations = relations(timeRuleTable, ({ one }) => ({
//   parkingSpot: one(parkingSpotTable, {
//     fields: [timeRuleTable.parkingSpotId],
//     references: [parkingSpotTable.id],
//   }),
// }))

// // Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
// export const _values_timeRuleDay = pgTable('values_TimeRule_day', {
//   day: text().primaryKey(),
// })

// export const timeRuleOverrideTable = pgTable(
//   'TimeRuleOverride',
//   {
//     ...standardFields,
//     parkingSpotId: uuid()
//       .notNull()
//       .references(() => parkingSpotTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
//     startsAt: instant().notNull(),
//     endsAt: instant().notNull(),
//     isAvailable: boolean().notNull(),
//   },
//   (table) => [index('TimeRuleOverride_parkingSpotId_idx').on(table.parkingSpotId)]
// )

// export const timeRuleOverridesRelations = relations(timeRuleOverrideTable, ({ one }) => ({
//   parkingSpot: one(parkingSpotTable, {
//     fields: [timeRuleOverrideTable.parkingSpotId],
//     references: [parkingSpotTable.id],
//   }),
// }))
