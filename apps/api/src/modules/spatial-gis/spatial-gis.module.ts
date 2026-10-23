import { Module } from '@nestjs/common';
import { SpatialGisService } from './spatial-gis.service';
import { SpatialGisController } from './spatial-gis.controller';

@Module({
  controllers: [SpatialGisController],
  providers: [SpatialGisService],
  exports: [SpatialGisService],
})
export class SpatialGisModule {}
