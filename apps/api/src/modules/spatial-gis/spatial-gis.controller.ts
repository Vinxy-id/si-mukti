import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SpatialGisService } from './spatial-gis.service';
import { GisActiveWasteQueryDto } from './dto/gis-query.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Spatial GIS (Peta Geospasial & Logistik Sentra Marmer)')
@Controller('gis')
export class SpatialGisController {
  constructor(private readonly spatialGisService: SpatialGisService) {}

  @Public()
  @Get('active-waste')
  @ApiOperation({
    summary: 'GeoJSON Titik Limbah Aktif (Pin Hijau & Oranye)',
    description: 'Mengembalikan FeatureCollection GeoJSON titik residu lumpur dan pecahan batu dengan filter PostGIS ST_DWithin.',
  })
  @ApiResponse({ status: 200, description: 'GeoJSON FeatureCollection berhasil diambil.' })
  async getActiveWaste(@Query() query: GisActiveWasteQueryDto) {
    return this.spatialGisService.getActiveWasteGeoJson(query);
  }

  @Public()
  @Get('offtakers')
  @ApiOperation({
    summary: 'GeoJSON Titik Pabrik Offtaker (Pin Ungu)',
    description: 'Mengembalikan lokasi fasilitas pengolah paving, teraso, dan pupuk kalsium beserta armada dump truck yang tersedia.',
  })
  @ApiResponse({ status: 200, description: 'GeoJSON fasilitas offtaker berhasil diambil.' })
  async getOfftakers(
    @Query('targetLat') targetLat?: number,
    @Query('targetLng') targetLng?: number,
    @Query('radiusKm') radiusKm?: number
  ) {
    return this.spatialGisService.getOfftakersGeoJson({ targetLat, targetLng, radiusKm });
  }

  @Public()
  @Get('metrics')
  @ApiOperation({
    summary: 'Telemetri Analitik Lingkungan Regional (Disperindag Pemkab Tulungagung)',
    description: 'Menampilkan neraca timbulan vs penyerapan residu, reduksi karbon (-38.2% CO2 eq), dan pencegahan pembuangan sungai.',
  })
  @ApiResponse({ status: 200, description: 'Metrik telemetri lingkungan berhasil diambil.' })
  async getEnvironmentalMetrics() {
    return this.spatialGisService.getEnvironmentalMetrics();
  }
}
