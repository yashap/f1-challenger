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
  CreateLeagueMemberRequest,
  ListLeagueMemberRequest,
  ListLeagueMemberResponse,
  LeagueMemberDto,
  DeleteLeagueMemberRequest,
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
  public readonly leagueMember = {
    listPage: (request: ListLeagueMemberRequest): Promise<ListLeagueMemberResponse> => {
      return extractListResponse(this.client.leagueMember.list({ query: request }))
    },
    listAllPages: async (request: Omit<ListLeagueMemberRequest, 'cursor'>): Promise<LeagueMemberDto[]> => {
      return fetchAllPages({ limit: DEFAULT_LIMIT, ...request }, (req) => this.leagueMember.listPage(req))
    },
    create: (request: CreateLeagueMemberRequest): Promise<LeagueMemberDto> => {
      return extractPostResponse(this.client.leagueMember.post({ body: request }))
    },
    get: (id: string): Promise<LeagueMemberDto | undefined> => {
      return extractGetByIdResponse(this.client.leagueMember.get({ params: { id } }))
    },
    delete: (request: DeleteLeagueMemberRequest): Promise<void> => {
      return extractDeleteResponse(this.client.leagueMember.delete({ body: request }))
    },
  }
}
