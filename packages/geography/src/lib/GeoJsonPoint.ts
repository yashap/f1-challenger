import { Point } from './Point'

type Longitude = number
type Latitude = number

// A geojson representation of a lat/long point
export interface GeoJsonPoint {
  type: 'Point'
  coordinates: [Longitude, Latitude]
}

export const geoJsonToPoint = (geoJsonPoint: GeoJsonPoint): Point => {
  const [longitude, latitude] = geoJsonPoint.coordinates
  return { longitude, latitude }
}
