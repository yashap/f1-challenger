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
  CreateParkingSpotRequest,
  ListParkingSpotsClosestToPointRequest,
  ListParkingSpotsClosestToPointResponse,
  ListParkingSpotsRequest,
  ListParkingSpotsResponse,
  ParkingSpotDto,
  UpdateParkingSpotRequest,
} from './model/types'

export class ChallengerClient {
  private client: ApiClient<typeof contract>

  public constructor(axiosInstance: ApiAxiosInstance) {
    this.client = ApiClientBuilder.build(contract, axiosInstance)
  }

  public static build(axiosConfig: AxiosConfig): ChallengerClient {
    return new ChallengerClient(AxiosInstanceBuilder.build(axiosConfig))
  }

  public readonly parkingSpots = {
    listPage: (request: ListParkingSpotsRequest): Promise<ListParkingSpotsResponse> => {
      return extractListResponse(this.client.parkingSpots.list({ query: request }))
    },
    listAllPages: async (request: Omit<ListParkingSpotsRequest, 'cursor'>): Promise<ParkingSpotDto[]> => {
      return fetchAllPages({ limit: DEFAULT_LIMIT, ...request }, (req) => this.parkingSpots.listPage(req))
    },
    listClosestToPoint: (
      request: ListParkingSpotsClosestToPointRequest
    ): Promise<ListParkingSpotsClosestToPointResponse> => {
      return extractListResponse(this.client.parkingSpots.listClosestToPoint({ query: request }))
    },
    create: (request: CreateParkingSpotRequest): Promise<ParkingSpotDto> => {
      return extractPostResponse(this.client.parkingSpots.post({ body: request }))
    },
    get: (id: string): Promise<ParkingSpotDto | undefined> => {
      return extractGetByIdResponse(this.client.parkingSpots.get({ params: { id } }))
    },
    update: (id: string, request: UpdateParkingSpotRequest): Promise<ParkingSpotDto> => {
      return extractPatchResponse(this.client.parkingSpots.patch({ params: { id }, body: request }))
    },
    delete: (id: string): Promise<void> => {
      return extractDeleteResponse(this.client.parkingSpots.delete({ params: { id } }))
    },
  }
}
