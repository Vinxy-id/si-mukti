import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('SI-MUKTI-Bootstrap');
  const app = await NestFactory.create(AppModule);

  // 1. Enable CORS untuk Next.js PWA & Leaflet Web-GIS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 2. Global Prefix API v1
  app.setGlobalPrefix('api/v1');

  // 3. Global Pipes & Filters
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    })
  );
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  // 4. Konfigurasi Swagger OpenAPI Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('SI-MUKTI REST API Platform')
    .setDescription(
      'Spesifikasi API Sistem Informasi Manajemen Spasial dan Rantai Pasok Marmer Menuju Kesejahteraan UMKM Kabupaten Tulungagung Inklusif. Standar PRD Versi 1.0 (LKTIN UNIMED 2026).'
    )
    .setVersion('1.0.0')
    .addTag('Auth (Otentikasi OTP WhatsApp)', 'Layanan otentikasi cepat pengrajin & pemangku kepentingan pentahelix')
    .addTag('Waste Logs (Pencatatan Residu & Volumetrik AI)', 'Pencatatan limbah sludge & afur dengan auto-capture GPS')
    .addTag('Spatial GIS (Peta Geospasial & Logistik Sentra Marmer)', 'Mesin spasial PostGIS ST_DWithin & GeoJSON Leaflet')
    .addTag('Logistics (Armada Truk & Multi-Stop Dispatch)', 'Penugasan armada offtaker & auto-credit MUKTI-Pay')
    .addTag('Passport Trace (Paspor Digital & Verifikasi Keaslian QR)', 'Verifikasi keaslian marmer anti-sintetis & e-Passport')
    .addTag('Wallet (Dompet MUKTI-Pay & Pencairan Bank Jatim)', 'Buku kas saldo insentif & pencairan rekening')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Masukkan JWT Token (tanpa prefix Bearer)',
        in: 'header',
      },
      'JWT-auth'
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'SI-MUKTI API Docs (Swagger)',
    customCss: '.swagger-ui .topbar { background-color: #00236F; }',
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);

  logger.log(`🚀 SI-MUKTI API Server berjalan pada port http://localhost:${port}/api/v1`);
  logger.log(`📚 Dokumentasi Swagger OpenAPI tersedia di http://localhost:${port}/api/docs`);
}

bootstrap();
