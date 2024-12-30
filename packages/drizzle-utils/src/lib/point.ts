import { Point } from '@f1-challenger/geography'
import { customType } from 'drizzle-orm/pg-core'
import { geomBinaryToPoint } from './geomBinaryToPoint'

export const point = customType<{
  data: Point
  driverData: string
}>({
  dataType() {
    return 'GEOMETRY(POINT,4326)'
  },

  fromDriver(value: string): Point {
    return geomBinaryToPoint(value)
  },

  toDriver(value: Point): string {
    if (value.longitude > 180 || value.longitude < -180) {
      throw new Error(`Longitude ${value.longitude} is out of range, must be between -180 and 180`)
    }
    if (value.latitude > 90 || value.latitude < -90) {
      throw new Error(`Latitude ${value.longitude} is out of range, must be between -90 and 90`)
    }
    return `POINT(${value.longitude} ${value.latitude})`
    // return `ST_GeomFromText('POINT(${value.longitude} ${value.latitude})', 4326))`
    // return `ST_SetSRID(ST_MakePoint(${value.longitude}, ${value.latitude}), 4326)`
  },
})
