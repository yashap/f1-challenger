import { Module } from '@nestjs/common'
import { Db } from 'src/db/Db'

@Module({
  providers: [Db],
  exports: [Db],
})
export class DbModule {}
