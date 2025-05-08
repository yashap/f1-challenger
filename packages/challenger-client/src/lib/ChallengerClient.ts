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
  ListDriverRequest,
  ListRaceRequest,
  CreateDraftRequest,
  ListDraftRequest,
  DeleteDraftRequest,
  CreateDraftPickRequest,
  ListDraftPickRequest,
  DeleteDraftPickRequest,
  ListDriverResponse,
  ListRaceResponse,
  ListDraftPickResponse,
  ListDraftResponse,
  DriverDto,
  RaceDto,
  DraftDto,
  DraftPickDto
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
  public readonly draft = {
    listPage: (request: ListDraftRequest): Promise<ListDraftResponse> => {
      return extractListResponse(this.client.draft.list({ query: request }))
    },
    listAllPages: async (request: Omit<ListDraftRequest, 'cursor'>): Promise<DraftDto[]> => {
      return fetchAllPages({ limit: DEFAULT_LIMIT, ...request }, (req) => this.race.listPage(req))
    },
    create: (request: CreateDraftRequest): Promise<DraftDto> => {
      return extractPostResponse(this.client.draft.post({ body: request }))
    },
    get: (id: string): Promise<DraftDto | undefined> => {
      return extractGetByIdResponse(this.client.draft.get({ params: { id } }))
    },
    delete: (request: DeleteDraftRequest): Promise<void> => {
      return extractDeleteResponse(this.client.draft.delete({ body: request }))
    },
  }
  public readonly draftPick = {
    listPage: (request: ListDraftPickRequest): Promise<ListDraftPickResponse> => {
      return extractListResponse(this.client.draftPick.list({ query: request }))
    },
    listAllPages: async (request: Omit<ListDraftPickRequest, 'cursor'>): Promise<DraftPickDto[]> => {
      return fetchAllPages({ limit: DEFAULT_LIMIT, ...request }, (req) => this.draftPick.listPage(req))
    },
    create: (request: CreateDraftPickRequest): Promise<DraftPickDto> => {
      return extractPostResponse(this.client.draftPick.post({ body: request }))
    },
    get: (id: string): Promise<DraftPickDto | undefined> => {
      return extractGetByIdResponse(this.client.draftPick.get({ params: { id } }))
    },
    delete: (request: DeleteDraftPickRequest): Promise<void> => {
      return extractDeleteResponse(this.client.draftPick.delete({ body: request }))
    },
  }
  public readonly driver = {
    listPage: (request: ListDriverRequest): Promise<ListDriverResponse> => {
      return extractListResponse(this.client.driver.list({ query: request }))
    },
    listAllPages: async (request: Omit<ListDriverRequest, 'cursor'>): Promise<DriverDto[]> => {
      return fetchAllPages({ limit: DEFAULT_LIMIT, ...request }, (req) => this.driver.listPage(req))
    },
    get: (id: string): Promise<DriverDto | undefined> => {
      return extractGetByIdResponse(this.client.driver.get({ params: { id } }))
    },
  }
  public readonly race = {
    listPage: (request: ListRaceRequest): Promise<ListRaceResponse> => {
      return extractListResponse(this.client.race.list({ query: request }))
    },
    listAllPages: async (request: Omit<ListRaceRequest, 'cursor'>): Promise<RaceDto[]> => {
      return fetchAllPages({ limit: DEFAULT_LIMIT, ...request }, (req) => this.race.listPage(req))
    },
    get: (id: string): Promise<RaceDto | undefined> => {
      return extractGetByIdResponse(this.client.race.get({ params: { id } }))
    },
  }
}

