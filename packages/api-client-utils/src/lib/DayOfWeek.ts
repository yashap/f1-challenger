import { z } from 'zod'

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const

export const DayOfWeekSchema = z.enum(daysOfWeek)

export type DayOfWeekDto = z.infer<typeof DayOfWeekSchema>

export const DayOfWeekValues = DayOfWeekSchema.Enum
export const DayOfWeekAllValues = DayOfWeekSchema.options

export const fromNumericDayOfWeek = (dayOfWeek: number): DayOfWeekDto => {
  const errorMessage = `Invalid day of week: ${dayOfWeek}. Must be an integer from 1 to 7`
  if (!Number.isInteger(dayOfWeek)) {
    throw new Error(errorMessage)
  }
  const dayOfWeekDto: DayOfWeekDto | undefined = daysOfWeek[dayOfWeek - 1]
  if (!dayOfWeekDto) {
    throw new Error(errorMessage)
  }
  return dayOfWeekDto
}

export const toNumericDayOfWeek = (dayOfWeek: DayOfWeekDto): number => {
  const index = daysOfWeek.indexOf(dayOfWeek)
  if (index === -1) {
    throw new Error(`Invalid day of week: ${dayOfWeek}. Must be one of: ${daysOfWeek.join(', ')}`)
  }
  return index + 1
}
