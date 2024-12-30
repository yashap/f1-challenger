import { Temporal } from '@js-temporal/polyfill'

export const expectSystemTimestamps = (
  { createdAt, updatedAt }: { createdAt: Temporal.Instant; updatedAt: Temporal.Instant },
  withinMilliseconds = 10_000
): void => {
  const now = Temporal.Now.instant().epochMilliseconds
  expect(createdAt.epochMilliseconds).toBeGreaterThanOrEqual(now - withinMilliseconds)
  expect(createdAt.epochMilliseconds).toBeLessThanOrEqual(now + withinMilliseconds)
  expect(updatedAt.epochMilliseconds).toBeGreaterThanOrEqual(now - withinMilliseconds)
  expect(updatedAt.epochMilliseconds).toBeLessThanOrEqual(now + withinMilliseconds)
}

export const expectSystemTimestampStrings = (
  { createdAt, updatedAt }: { createdAt: string; updatedAt: string },
  withinMilliseconds = 10_000
): void => {
  expectSystemTimestamps(
    { createdAt: Temporal.Instant.from(createdAt), updatedAt: Temporal.Instant.from(updatedAt) },
    withinMilliseconds
  )
}
