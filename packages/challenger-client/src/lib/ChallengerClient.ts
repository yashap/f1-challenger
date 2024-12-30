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
  CreateLeagueMembersRequest,
  ListLeagueMembersRequest,
  ListLeagueMembersResponse,
  LeagueMembersDto,
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
  public readonly leagueMembers = {
    listPage: (request: ListLeagueMembersRequest): Promise<ListLeagueMembersResponse> => {
      return extractListResponse(this.client.leagueMembers.list({ query: request }))
    },
    listAllPages: async (request: Omit<ListLeagueMembersRequest, 'cursor'>): Promise<LeagueMembersDto[]> => {
      return fetchAllPages({ limit: DEFAULT_LIMIT, ...request }, (req) => this.leagueMembers.listPage(req))
    },
    create: (request: CreateLeagueMembersRequest): Promise<LeagueMembersDto> => {
      return extractPostResponse(this.client.leagueMembers.post({ body: request }))
    },
    get: (id: string): Promise<LeagueMembersDto | undefined> => {
      return extractGetByIdResponse(this.client.leagueMembers.get({ params: { id } }))
    },
    delete: (id: string): Promise<void> => {
      return extractDeleteResponse(this.client.leagueMembers.delete({ params: { id } }))
    },
  }
}
