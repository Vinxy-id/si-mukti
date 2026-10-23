import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { WasteLogModule } from './modules/waste-log/waste-log.module';
import { SpatialGisModule } from './modules/spatial-gis/spatial-gis.module';
import { LogisticsModule } from './modules/logistics/logistics.module';
import { PassportTraceModule } from './modules/passport-trace/passport-trace.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
    DatabaseModule,
    AuthModule,
    WasteLogModule,
    SpatialGisModule,
    LogisticsModule,
    PassportTraceModule,
    WalletModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
