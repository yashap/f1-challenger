import { z } from 'zod'

export const ServerErrorSchema = z.object({
  message: z.string().describe('Human readable description of the error'),
  code: z.string().describe('Description of the error to code against'),
  metadata: z.any().optional().describe('Additional data associated with the error'),
})

export type ServerErrorDto = z.infer<typeof ServerErrorSchema>
