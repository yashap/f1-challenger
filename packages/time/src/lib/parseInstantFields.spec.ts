import { InputValidationError } from '@f1-challenger/errors'
import { Temporal } from '@js-temporal/polyfill'
import { parseInstantFields } from './parseInstantFields'

describe(parseInstantFields.name, () => {
  it('parses instant fields with string values', () => {
    expect(
      parseInstantFields(
        {
          id: 1,
          name: 'Foo',
          createdAt: '2020-01-23T17:04:36Z',
          updatedAt: '2023-01-11T14:13:29Z',
        },
        ['createdAt', 'updatedAt']
      )
    ).toStrictEqual({
      createdAt: Temporal.Instant.from('2020-01-23T17:04:36Z'),
      updatedAt: Temporal.Instant.from('2023-01-11T14:13:29Z'),
    })
  })

  it('parses instant fields with Date values', () => {
    expect(
      parseInstantFields(
        {
          id: 1,
          name: 'Foo',
          createdAt: new Date('2020-01-23T17:04:36Z'),
          updatedAt: new Date('2023-01-11T14:13:29Z'),
        },
        ['createdAt', 'updatedAt']
      )
    ).toStrictEqual({
      createdAt: Temporal.Instant.from('2020-01-23T17:04:36Z'),
      updatedAt: Temporal.Instant.from('2023-01-11T14:13:29Z'),
    })
  })

  it('throws an InputValidationError if the field constains a non-string value', () => {
    expect(() =>
      parseInstantFields(
        {
          id: 1,
          name: 'Foo',
          createdAt: '2020-01-23T17:04:36Z',
          updatedAt: 100,
        },
        ['createdAt', 'updatedAt']
      )
    ).toThrow(InputValidationError)
  })

  it('throws an InputValidationError if the field constains an invalid string value', () => {
    expect(() =>
      parseInstantFields(
        {
          id: 1,
          name: 'Foo',
          createdAt: '2020-01-23T17:04:36Z',
          updatedAt: '2020-01-23T17:04:36', // missing time offset
        },
        ['createdAt', 'updatedAt']
      )
    ).toThrow(InputValidationError)

    expect(() =>
      parseInstantFields(
        {
          id: 1,
          name: 'Foo',
          createdAt: '2020-01-23T17:04:36Z',
          updatedAt: 'nope', // not a timestamp string at all
        },
        ['createdAt', 'updatedAt']
      )
    ).toThrow(InputValidationError)
  })

  it('throws an InputValidationError if the object lacks any of the requested fields', () => {
    expect(() =>
      parseInstantFields(
        {
          id: 1,
          name: 'Foo',
          createdAt: '2020-01-23T17:04:36Z',
        } as unknown as Record<'createdAt' | 'updatedAt', string>,
        ['createdAt', 'updatedAt']
      )
    ).toThrow(InputValidationError)
  })
})
