import { Module } from '@nestjs/common'
import { DbModule } from 'src/db/DbModule'
import { ParkingSpotController } from 'src/domain/parkingSpot/ParkingSpotController'

@Module({
  controllers: [ParkingSpotController],
  imports: [DbModule],
})
export class ParkingSpotModule {}
