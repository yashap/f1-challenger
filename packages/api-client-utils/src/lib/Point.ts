import { z } from 'zod'

export const PointSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
})

export type PointDto = z.infer<typeof PointSchema>
