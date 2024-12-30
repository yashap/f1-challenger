import { z } from 'zod'
import {
  CreateLeagueRequestSchema,
  ListLeaguesResponseSchema,
  ListLeaguesRequestSchema,
  LeagueSchema,
  UpdateLeagueRequestSchema,
  LeagueStatusSchema,
} from './League'

// Requests
export type CreateLeagueRequest = z.infer<typeof CreateLeagueRequestSchema>
export type ListLeaguesRequest = z.infer<typeof ListLeaguesRequestSchema>
export type UpdateLeagueRequest = z.infer<typeof UpdateLeagueRequestSchema>

// Responses
export type ListLeaguesResponse = z.infer<typeof ListLeaguesResponseSchema>

// Data Models
export type LeagueDto = z.infer<typeof LeagueSchema>
export const LeagueStatusValues = LeagueStatusSchema.Enum
export const LeagueStatusAllValues = LeagueStatusSchema.options
