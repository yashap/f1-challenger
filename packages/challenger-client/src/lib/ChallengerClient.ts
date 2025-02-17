import {
  ApiAxiosInstance,
  ApiClient,
  ApiClientBuilder,
  AxiosConfig,
  AxiosInstanceBuilder,
  extractDeleteResponse,
  extractGetByIdResponse,
  extractListResponse,
  extractPatchResponse,
  extractPostResponse,
  fetchAllPages,
} from '@f1-challenger/api-client-utils'
import { DEFAULT_LIMIT } from '@f1-challenger/pagination'
import { contract } from './contract'
import {
  CreateLeagueRequest,
  ListLeaguesRequest,
  ListLeaguesResponse,
  LeagueDto,
  UpdateLeagueRequest,
  CreateTeamRequest,
  ListTeamRequest,
  ListTeamResponse,
  TeamDto,
  DeleteTeamRequest,
} from './model/types'

export class ChallengerClient {
  private client: ApiClient<typeof contract>

  public constructor(axiosInstance: ApiAxiosInstance) {
    this.client = ApiClientBuilder.build(contract, axiosInstance)
  }

  public static build(axiosConfig: AxiosConfig): ChallengerClient {
    return new ChallengerClient(AxiosInstanceBuilder.build(axiosConfig))
  }

  public readonly leagues = {
    listPage: (request: ListLeaguesRequest): Promise<ListLeaguesResponse> => {
      return extractListResponse(this.client.leagues.list({ query: request }))
    },
    listAllPages: async (request: Omit<ListLeaguesRequest, 'cursor'>): Promise<LeagueDto[]> => {
      return fetchAllPages({ limit: DEFAULT_LIMIT, ...request }, (req) => this.leagues.listPage(req))
    },
    create: (request: CreateLeagueRequest): Promise<LeagueDto> => {
      return extractPostResponse(this.client.leagues.post({ body: request }))
    },
    get: (id: string): Promise<LeagueDto | undefined> => {
      return extractGetByIdResponse(this.client.leagues.get({ params: { id } }))
    },
    update: (id: string, request: UpdateLeagueRequest): Promise<LeagueDto> => {
      return extractPatchResponse(this.client.leagues.patch({ params: { id }, body: request }))
    },
    delete: (id: string): Promise<void> => {
      return extractDeleteResponse(this.client.leagues.delete({ params: { id } }))
    },
  }
  public readonly teams = {
    listPage: (request: ListTeamRequest): Promise<ListTeamResponse> => {
      return extractListResponse(this.client.teams.list({ query: request }))
    },
    listAllPages: async (request: Omit<ListTeamRequest, 'cursor'>): Promise<TeamDto[]> => {
      return fetchAllPages({ limit: DEFAULT_LIMIT, ...request }, (req) => this.teams.listPage(req))
    },
    create: (request: CreateTeamRequest): Promise<TeamDto> => {
      return extractPostResponse(this.client.teams.post({ body: request }))
    },
    get: (id: string): Promise<TeamDto | undefined> => {
      return extractGetByIdResponse(this.client.teams.get({ params: { id } }))
    },
    delete: (request: DeleteTeamRequest): Promise<void> => {
      return extractDeleteResponse(this.client.teams.delete({ body: request }))
    },
  }
}
