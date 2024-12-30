import { IllegalInputError } from '@f1-challenger/errors'
import { Temporal } from '@js-temporal/polyfill'
import { formatInstantFields } from './formatInstantFields'

describe(formatInstantFields.name, () => {
  it('formats instant fields', () => {
    expect(
      formatInstantFields(
        {
          id: 1,
          name: 'Foo',
          createdAt: Temporal.Instant.from('2020-01-23T17:04:36Z'),
          updatedAt: Temporal.Instant.from('2023-01-11T14:13:29Z'),
        },
        ['createdAt', 'updatedAt']
      )
    ).toStrictEqual({
      createdAt: '2020-01-23T17:04:36Z',
      updatedAt: '2023-01-11T14:13:29Z',
    })
  })

  it('throws an IllegalInputError if the field constains a non-instant value', () => {
    expect(() =>
      formatInstantFields(
        {
          id: 1,
          name: 'Foo',
          createdAt: '2020-01-23T17:04:36Z', // string, not an instant
          updatedAt: '2020-01-23T17:04:36Z',
        },
        ['createdAt', 'updatedAt']
      )
    ).toThrow(IllegalInputError)
  })

  it('throws an IllegalInputError if the object lacks any of the requested fields', () => {
    expect(() =>
      formatInstantFields(
        {
          id: 1,
          name: 'Foo',
          createdAt: Temporal.Instant.from('2020-01-23T17:04:36Z'),
        } as unknown as Record<'createdAt' | 'updatedAt', string>,
        ['createdAt', 'updatedAt']
      )
    ).toThrow(IllegalInputError)
  })
})
