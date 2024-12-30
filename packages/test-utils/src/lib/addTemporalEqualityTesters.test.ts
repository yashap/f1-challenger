import { Temporal } from '@js-temporal/polyfill'
import { addTemporalEqualityTesters } from './addTemporalEqualityTesters'

describe(addTemporalEqualityTesters.name, () => {
  beforeAll(() => {
    addTemporalEqualityTesters()
  })

  it('allows you to properly compare two temporal instants', () => {
    expect(Temporal.Instant.from('2021-01-01T00:00:00Z')).toEqual(Temporal.Instant.from('2021-01-01T00:00:00Z'))
    expect(Temporal.Instant.from('2021-01-01T00:00:00Z')).not.toEqual(Temporal.Instant.from('2021-01-01T00:00:01Z'))
  })

  it('allows you to properly compare two temporal plain times', () => {
    expect(Temporal.PlainTime.from('00:00:00')).toEqual(Temporal.PlainTime.from('00:00:00'))
    expect(Temporal.PlainTime.from('00:00:00')).not.toEqual(Temporal.PlainTime.from('00:00:01'))
  })

  it('allows you to properly compare two temporal zoned date times', () => {
    expect(Temporal.ZonedDateTime.from('2021-01-01T00:00:00+02:00[Africa/Cairo]')).toEqual(
      Temporal.ZonedDateTime.from('2021-01-01T00:00:00+02:00[Africa/Cairo]')
    )
    expect(Temporal.ZonedDateTime.from('2021-01-01T00:00:00+02:00[Africa/Cairo]')).not.toEqual(
      Temporal.ZonedDateTime.from('2021-01-01T00:00:01+02:00[Africa/Cairo]')
    )
  })

  it('allows you to properly compare two temporal plain dates', () => {
    expect(Temporal.PlainDate.from('2021-01-01')).toEqual(Temporal.PlainDate.from('2021-01-01'))
    expect(Temporal.PlainDate.from('2021-01-01')).not.toEqual(Temporal.PlainDate.from('2021-01-02'))
  })

  it('allows you to properly compare two temporal plain date times', () => {
    expect(Temporal.PlainDateTime.from('2021-01-01T00:00:00')).toEqual(
      Temporal.PlainDateTime.from('2021-01-01T00:00:00')
    )
    expect(Temporal.PlainDateTime.from('2021-01-01T00:00:00')).not.toEqual(
      Temporal.PlainDateTime.from('2021-01-01T00:00:01')
    )
  })

  it('allows you to properly compare two temporal plain year months', () => {
    expect(Temporal.PlainYearMonth.from('2021-01')).toEqual(Temporal.PlainYearMonth.from('2021-01'))
    expect(Temporal.PlainYearMonth.from('2021-01')).not.toEqual(Temporal.PlainYearMonth.from('2021-02'))
  })

  it('allows you to properly compare two temporal plain month days', () => {
    expect(Temporal.PlainMonthDay.from('01-10')).toEqual(Temporal.PlainMonthDay.from('01-10'))
    expect(Temporal.PlainMonthDay.from('01-10')).not.toEqual(Temporal.PlainMonthDay.from('01-11'))
  })

  it('allows you to properly compare two temporal durations', () => {
    expect(Temporal.Duration.from('PT1S')).toEqual(Temporal.Duration.from('PT1S'))
    expect(Temporal.Duration.from('PT1S')).not.toEqual(Temporal.Duration.from('PT2S'))
  })

  it('has no impact unless both objects are of the same Temporal type', () => {
    expect(Temporal.Instant.from('2021-01-01T00:00:00Z')).not.toEqual(Temporal.PlainTime.from('00:00:00'))
    expect(Temporal.Instant.from('2021-01-01T00:00:00Z')).not.toEqual(10)
    expect(Temporal.PlainTime.from('00:00:00')).not.toEqual(
      Temporal.ZonedDateTime.from('2021-01-01T00:00:00+02:00[Africa/Cairo]')
    )
    expect(Temporal.PlainTime.from('00:00:00')).not.toEqual(10)
    expect(Temporal.ZonedDateTime.from('2021-01-01T00:00:00+02:00[Africa/Cairo]')).not.toEqual(
      Temporal.PlainDate.from('2021-01-01')
    )
    expect(Temporal.ZonedDateTime.from('2021-01-01T00:00:00+02:00[Africa/Cairo]')).not.toEqual(10)
    expect(Temporal.PlainDate.from('2021-01-01')).not.toEqual(Temporal.PlainDateTime.from('2021-01-01T00:00:00'))
    expect(Temporal.PlainDate.from('2021-01-01')).not.toEqual(10)
    expect(Temporal.PlainDateTime.from('2021-01-01T00:00:00')).not.toEqual(Temporal.Duration.from('PT1S'))
    expect(Temporal.PlainDateTime.from('2021-01-01T00:00:00')).not.toEqual(10)
    expect(Temporal.PlainYearMonth.from('2021-01')).not.toEqual(Temporal.Duration.from('PT1S'))
    expect(Temporal.PlainYearMonth.from('2021-01')).not.toEqual(10)
    expect(Temporal.PlainMonthDay.from('01-10')).not.toEqual(Temporal.Duration.from('PT1S'))
    expect(Temporal.PlainMonthDay.from('01-10')).not.toEqual(10)
    expect(Temporal.Duration.from('PT1S')).not.toEqual(Temporal.PlainYearMonth.from('2021-01'))
    expect(Temporal.Duration.from('PT1S')).not.toEqual(10)
    expect(10).toEqual(10)
    expect(10).not.toEqual(11)
  })
})
