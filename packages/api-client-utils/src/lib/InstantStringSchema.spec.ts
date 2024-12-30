import { Temporal } from '@js-temporal/polyfill'
import { InstantStringSchema } from './InstantStringSchema'

describe('InstantStringSchema', () => {
  it('allows valid instants', () => {
    expect(InstantStringSchema.parse('2012-11-12T00:00:00Z')).toStrictEqual(
      Temporal.Instant.from('2012-11-12T00:00:00Z')
    )
    expect(InstantStringSchema.parse('2012-11-12T12:13:14.123Z')).toStrictEqual(
      Temporal.Instant.from('2012-11-12T12:13:14.123Z')
    )
    expect(InstantStringSchema.parse('2012-11-12T23:59:59Z')).toStrictEqual(
      Temporal.Instant.from('2012-11-12T23:59:59Z')
    )
  })

  it('does not allow invalid times', () => {
    expect(() => InstantStringSchema.parse('hello')).toThrow()
    expect(() => InstantStringSchema.parse('T00:00:00')).toThrow()
    expect(() => InstantStringSchema.parse('-00:00:00')).toThrow()
    expect(() => InstantStringSchema.parse('2012-11-12T1:00:00Z')).toThrow()
    expect(() => InstantStringSchema.parse('2012-11-12T25:00:00Z')).toThrow()
    expect(() => InstantStringSchema.parse('2012-11-12T12:60:00Z')).toThrow()
    expect(() => InstantStringSchema.parse('2012-11-12T12:00:70Z')).toThrow()
    expect(() => InstantStringSchema.parse('2012-11-12T12:00:70')).toThrow()
    expect(() => InstantStringSchema.parse('2012-11-12')).toThrow()
  })
})
