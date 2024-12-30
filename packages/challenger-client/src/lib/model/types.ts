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
  CreateLeagueMembersRequestSchema,
  ListLeagueMembersResponseSchema,
  ListLeagueMembersRequestSchema,
  LeagueMembersSchema,
} from './LeagueMembers'

// Requests
export type CreateLeagueRequest = z.infer<typeof CreateLeagueRequestSchema>
export type ListLeaguesRequest = z.infer<typeof ListLeaguesRequestSchema>
export type UpdateLeagueRequest = z.infer<typeof UpdateLeagueRequestSchema>
export type CreateLeagueMembersRequest = z.infer<typeof CreateLeagueMembersRequestSchema>
export type ListLeagueMembersRequest = z.infer<typeof ListLeagueMembersRequestSchema>

// Responses
export type ListLeaguesResponse = z.infer<typeof ListLeaguesResponseSchema>
export type ListLeagueMembersResponse = z.infer<typeof ListLeagueMembersResponseSchema>

// Data Models
export type LeagueDto = z.infer<typeof LeagueSchema>
export const LeagueStatusValues = LeagueStatusSchema.Enum
export const LeagueStatusAllValues = LeagueStatusSchema.options
export type LeagueMembersDto = z.infer<typeof LeagueMembersSchema>
