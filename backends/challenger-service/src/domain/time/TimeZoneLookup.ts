import { required } from '@f1-challenger/errors'
import { Point } from '@f1-challenger/geography'
import { find } from 'geo-tz'

export class TimeZoneLookup {
  public static getTimeZonesForPoint(point: Point): string[] {
    return find(point.latitude, point.longitude)
  }

  public static getTimeZoneForPoint(point: Point): string {
    return required(this.getTimeZonesForPoint(point)[0], `Time zone not found for point: ${JSON.stringify(point)}`)
  }
}
