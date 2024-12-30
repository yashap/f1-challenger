import { Temporal } from '@js-temporal/polyfill'

const areInstantsEqual = (a: unknown, b: unknown): boolean | undefined => {
  const isInstanceA = a instanceof Temporal.Instant
  const isInstanceB = b instanceof Temporal.Instant

  if (isInstanceA && isInstanceB) {
    return a.equals(b)
  } else if (isInstanceA === isInstanceB) {
    return undefined
  } else {
    return false
  }
}

const arePlainTimesEqual = (a: unknown, b: unknown): boolean | undefined => {
  const isInstanceA = a instanceof Temporal.PlainTime
  const isInstanceB = b instanceof Temporal.PlainTime

  if (isInstanceA && isInstanceB) {
    return a.equals(b)
  } else if (isInstanceA === isInstanceB) {
    return undefined
  } else {
    return false
  }
}

const areZonedDateTimesEqual = (a: unknown, b: unknown): boolean | undefined => {
  const isInstanceA = a instanceof Temporal.ZonedDateTime
  const isInstanceB = b instanceof Temporal.ZonedDateTime

  if (isInstanceA && isInstanceB) {
    return a.equals(b)
  } else if (isInstanceA === isInstanceB) {
    return undefined
  } else {
    return false
  }
}

const arePlainDatesEqual = (a: unknown, b: unknown): boolean | undefined => {
  const isInstanceA = a instanceof Temporal.PlainDate
  const isInstanceB = b instanceof Temporal.PlainDate

  if (isInstanceA && isInstanceB) {
    return a.equals(b)
  } else if (isInstanceA === isInstanceB) {
    return undefined
  } else {
    return false
  }
}

const arePlainDateTimesEqual = (a: unknown, b: unknown): boolean | undefined => {
  const isInstanceA = a instanceof Temporal.PlainDateTime
  const isInstanceB = b instanceof Temporal.PlainDateTime

  if (isInstanceA && isInstanceB) {
    return a.equals(b)
  } else if (isInstanceA === isInstanceB) {
    return undefined
  } else {
    return false
  }
}

const arePlainYearMonthsEqual = (a: unknown, b: unknown): boolean | undefined => {
  const isInstanceA = a instanceof Temporal.PlainYearMonth
  const isInstanceB = b instanceof Temporal.PlainYearMonth

  if (isInstanceA && isInstanceB) {
    return a.equals(b)
  } else if (isInstanceA === isInstanceB) {
    return undefined
  } else {
    return false
  }
}

const arePlainMonthDaysEqual = (a: unknown, b: unknown): boolean | undefined => {
  const isInstanceA = a instanceof Temporal.PlainMonthDay
  const isInstanceB = b instanceof Temporal.PlainMonthDay

  if (isInstanceA && isInstanceB) {
    return a.equals(b)
  } else if (isInstanceA === isInstanceB) {
    return undefined
  } else {
    return false
  }
}

const areDurationsEqual = (a: unknown, b: unknown): boolean | undefined => {
  const isInstanceA = a instanceof Temporal.Duration
  const isInstanceB = b instanceof Temporal.Duration

  if (isInstanceA && isInstanceB) {
    return Temporal.Duration.compare(a, b) === 0
  } else if (isInstanceA === isInstanceB) {
    return undefined
  } else {
    return false
  }
}

export const addTemporalEqualityTesters = () => {
  // eslint-disable-next-line
  const expectGlobal = require('@jest/globals').expect as {
    addEqualityTesters(testers: ((a: unknown, b: unknown) => boolean | undefined)[]): void
  }
  expectGlobal.addEqualityTesters([
    areInstantsEqual,
    arePlainTimesEqual,
    areZonedDateTimesEqual,
    arePlainDatesEqual,
    arePlainDateTimesEqual,
    arePlainYearMonthsEqual,
    arePlainMonthDaysEqual,
    areDurationsEqual,
  ])
}
