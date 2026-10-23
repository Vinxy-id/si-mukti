import { Module } from '@nestjs/common';
import { WasteLogService } from './waste-log.service';
import { WasteLogController } from './waste-log.controller';

@Module({
  controllers: [WasteLogController],
  providers: [WasteLogService],
  exports: [WasteLogService],
})
export class WasteLogModule {}
