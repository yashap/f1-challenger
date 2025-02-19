import { z } from 'zod'
import {
  CreateLeagueRequestSchema,
  ListLeaguesResponseSchema,
  ListLeaguesRequestSchema,
  LeagueSchema,
  UpdateLeagueRequestSchema,
  LeagueStatusSchema,
} from './League'
import {
  CreateTeamRequestSchema,
  ListTeamResponseSchema,
  ListTeamRequestSchema,
  TeamSchema,
  UpdateTeamRequestSchema,
} from './Team'

// Requests
export type CreateLeagueRequest = z.infer<typeof CreateLeagueRequestSchema>
export type ListLeaguesRequest = z.infer<typeof ListLeaguesRequestSchema>
export type UpdateLeagueRequest = z.infer<typeof UpdateLeagueRequestSchema>
export type CreateTeamRequest = z.infer<typeof CreateTeamRequestSchema>
export type UpdateTeamRequest = z.infer<typeof UpdateTeamRequestSchema>
export type ListTeamRequest = z.infer<typeof ListTeamRequestSchema>

// Responses
export type ListLeaguesResponse = z.infer<typeof ListLeaguesResponseSchema>
export type ListTeamResponse = z.infer<typeof ListTeamResponseSchema>

// Data Models
export type LeagueDto = z.infer<typeof LeagueSchema>
export const LeagueStatusValues = LeagueStatusSchema.Enum
export const LeagueStatusAllValues = LeagueStatusSchema.options
export type TeamDto = z.infer<typeof TeamSchema>
