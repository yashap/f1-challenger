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
import {
  CreateTeamRequestSchema,
  ListTeamResponseSchema,
  ListTeamRequestSchema,
  TeamSchema,
  UpdateTeamRequestSchema,
} from './Team'
import {
  CreateDraftRequestSchema,
  ListDraftResponseSchema,
  ListDraftRequestSchema,
  DraftSchema,
  DeleteDraftRequestSchema,
  DraftStatusSchema,
} from './Draft'
import {
  CreateDraftPickRequestSchema,
  ListDraftPickRequestSchema,
  ListDraftPickResponseSchema,
  DeleteDraftPickRequestSchema,
  DraftPickSchema,
  DraftPickStatusSchema,
} from './DraftPick'
import {
  ListDriverRequestSchema,
  ListDriverResponseSchema,
  DriverSchema,
} from './Driver'
import {
  ListRaceRequestSchema,
  ListRaceResponseSchema,
  RaceSchema,
  RaceStatusSchema,
} from './Race'

// Requests
export type CreateLeagueRequest = z.infer<typeof CreateLeagueRequestSchema>
export type ListLeaguesRequest = z.infer<typeof ListLeaguesRequestSchema>
export type UpdateLeagueRequest = z.infer<typeof UpdateLeagueRequestSchema>
export type CreateLeagueMemberRequest = z.infer<typeof CreateLeagueMemberRequestSchema>
export type ListLeagueMemberRequest = z.infer<typeof ListLeagueMemberRequestSchema>
export type DeleteLeagueMemberRequest = z.infer<typeof DeleteLeagueMemberRequestSchema>
export type ListDriverRequest = z.infer<typeof ListDriverRequestSchema>
export type ListRaceRequest = z.infer<typeof ListRaceRequestSchema>
export type CreateDraftRequest = z.infer<typeof CreateDraftRequestSchema>
export type ListDraftRequest = z.infer<typeof ListDraftRequestSchema>
export type DeleteDraftRequest = z.infer<typeof DeleteDraftRequestSchema>
export type CreateDraftPickRequest = z.infer<typeof CreateDraftPickRequestSchema>
export type ListDraftPickRequest = z.infer<typeof ListDraftPickRequestSchema>
export type DeleteDraftPickRequest = z.infer<typeof DeleteDraftPickRequestSchema>

export type CreateTeamRequest = z.infer<typeof CreateTeamRequestSchema>
export type UpdateTeamRequest = z.infer<typeof UpdateTeamRequestSchema>
export type ListTeamRequest = z.infer<typeof ListTeamRequestSchema>

// Responses
export type ListLeaguesResponse = z.infer<typeof ListLeaguesResponseSchema>
export type ListLeagueMemberResponse = z.infer<typeof ListDriverResponseSchema>
export type ListDriverResponse = z.infer<typeof ListLeagueMemberResponseSchema>
export type ListRaceResponse = z.infer<typeof ListRaceResponseSchema>
export type ListDraftPickResponse = z.infer<typeof ListDraftPickResponseSchema>
export type ListDraftResponse = z.infer<typeof ListDraftResponseSchema>

export type ListTeamResponse = z.infer<typeof ListTeamResponseSchema>

// Data Models
export type LeagueDto = z.infer<typeof LeagueSchema>
export const LeagueStatusValues = LeagueStatusSchema.Enum
export const LeagueStatusAllValues = LeagueStatusSchema.options
export type LeagueMemberDto = z.infer<typeof LeagueMemberSchema>
export type DriverDto = z.infer<typeof DriverSchema>
export type RaceDto = z.infer<typeof RaceSchema>
export type DraftDto = z.infer<typeof DraftSchema>
export type DraftPickDto = z.infer<typeof DraftPickSchema>
export const DraftPickStatusValues = DraftPickStatusSchema.Enum
export const DraftPickStatusAllValues = DraftPickStatusSchema.options
export const DraftStatusValues = DraftStatusSchema.Enum
export const DraftStatusAllValues = DraftStatusSchema.options
export const RaceStatusValues = RaceStatusSchema.Enum
export const RaceStatusAllValues = RaceStatusSchema.options

export type TeamDto = z.infer<typeof TeamSchema>
