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
  CreateLeagueMemberRequestSchema,
  ListLeagueMemberResponseSchema,
  ListLeagueMemberRequestSchema,
  LeagueMemberSchema,
  DeleteLeagueMemberRequestSchema,
} from './LeagueMember'

// Requests
export type CreateLeagueRequest = z.infer<typeof CreateLeagueRequestSchema>
export type ListLeaguesRequest = z.infer<typeof ListLeaguesRequestSchema>
export type UpdateLeagueRequest = z.infer<typeof UpdateLeagueRequestSchema>
export type CreateLeagueMemberRequest = z.infer<typeof CreateLeagueMemberRequestSchema>
export type ListLeagueMemberRequest = z.infer<typeof ListLeagueMemberRequestSchema>
export type DeleteLeagueMemberRequest = z.infer<typeof DeleteLeagueMemberRequestSchema>

// Responses
export type ListLeaguesResponse = z.infer<typeof ListLeaguesResponseSchema>
export type ListLeagueMemberResponse = z.infer<typeof ListLeagueMemberResponseSchema>

// Data Models
export type LeagueDto = z.infer<typeof LeagueSchema>
export const LeagueStatusValues = LeagueStatusSchema.Enum
export const LeagueStatusAllValues = LeagueStatusSchema.options
export type LeagueMemberDto = z.infer<typeof LeagueMemberSchema>
