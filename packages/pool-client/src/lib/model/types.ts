import { z } from 'zod'
import {
  CreateParkingSpotRequestSchema,
  ListParkingSpotsClosestToPointRequestSchema,
  ListParkingSpotsResponseSchema,
  ListParkingSpotsRequestSchema,
  ParkingSpotSchema,
  UpdateParkingSpotRequestSchema,
  ListParkingSpotsClosestToPointResponseSchema,
} from './ParkingSpot'

// Requests
export type CreateParkingSpotRequest = z.infer<typeof CreateParkingSpotRequestSchema>
export type ListParkingSpotsRequest = z.infer<typeof ListParkingSpotsRequestSchema>
export type ListParkingSpotsClosestToPointRequest = z.infer<typeof ListParkingSpotsClosestToPointRequestSchema>
export type UpdateParkingSpotRequest = z.infer<typeof UpdateParkingSpotRequestSchema>

// Responses
export type ListParkingSpotsClosestToPointResponse = z.infer<typeof ListParkingSpotsClosestToPointResponseSchema>
export type ListParkingSpotsResponse = z.infer<typeof ListParkingSpotsResponseSchema>

// Data Models
export type ParkingSpotDto = z.infer<typeof ParkingSpotSchema>
