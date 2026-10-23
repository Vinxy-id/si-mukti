import { Module } from '@nestjs/common';
import { PassportTraceService } from './passport-trace.service';
import { PassportTraceController } from './passport-trace.controller';

@Module({
  controllers: [PassportTraceController],
  providers: [PassportTraceService],
  exports: [PassportTraceService],
})
export class PassportTraceModule {}
