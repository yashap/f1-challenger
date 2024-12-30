import { required } from '@f1-challenger/errors'
import { Temporal } from '@js-temporal/polyfill'
import { User, TestDb, Reminder } from '../test/TestDb'
import { reminderTable, userTable } from '../test/testSchema'
import { instant } from './instant'

describe(instant.name, () => {
  let user: User

  const createUser = async (name: string): Promise<User> => {
    const result = await TestDb.db().insert(userTable).values({ name }).returning()
    expect(result).toHaveLength(1)
    return required(result[0])
  }

  const createReminder = async (
    description: string,
    time: Temporal.PlainTime,
    author: User = user
  ): Promise<Reminder> => {
    const result = await TestDb.db().insert(reminderTable).values({ userId: author.id, description, time }).returning()
    expect(result).toHaveLength(1)
    return required(result[0])
  }

  const getAllReminders = (): Promise<Reminder[]> => {
    return TestDb.db().query.reminderTable.findMany({
      orderBy: (reminders, { asc }) => [asc(reminders.description)],
    })
  }

  beforeEach(async () => {
    user = await createUser('Bob')
  })

  it('should save and retrieve reminders', async () => {
    const firstReminder = await createReminder('Breakfast', Temporal.PlainTime.from('08:10:11'))
    const secondReminder = await createReminder('Lunch', Temporal.PlainTime.from('12:34:56'))

    const allReminders = await getAllReminders()

    expect(allReminders).toStrictEqual([
      {
        id: firstReminder.id,
        createdAt: firstReminder.createdAt,
        updatedAt: firstReminder.updatedAt,
        userId: user.id,
        description: 'Breakfast',
        time: Temporal.PlainTime.from('08:10:11'),
      },
      {
        id: secondReminder.id,
        createdAt: secondReminder.createdAt,
        updatedAt: secondReminder.updatedAt,
        userId: user.id,
        description: 'Lunch',
        time: Temporal.PlainTime.from('12:34:56'),
      },
    ])
  })
})
