import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WasteLogService } from './waste-log.service';
import { CreateWasteLogDto } from './dto/create-waste-log.dto';
import { VolumetricAuditDto } from './dto/volumetric-audit.dto';
import { CurrentUser, AuthUserPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('Waste Logs (Pencatatan Residu & Volumetrik AI)')
@ApiBearerAuth('JWT-auth')
@Controller('waste-logs')
export class WasteLogController {
  constructor(private readonly wasteLogService: WasteLogService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Catat Residu Limbah Baru (Sludge / Afur)',
    description: 'Menyimpan laporan timbulan limbah pengrajin lengkap dengan GPS auto-capture dan estimasi tonase.',
  })
  @ApiResponse({ status: 201, description: 'Residu limbah berhasil tercatat.' })
  async create(
    @Body() dto: CreateWasteLogDto,
    @CurrentUser() user: AuthUserPayload
  ) {
    return this.wasteLogService.create(dto, user);
  }

  @Post('volumetric-audit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Audit Volumetrik AI (Computer Vision Estimator)',
    description: 'Menganalisis citra bak limbah kamera pengrajin untuk menghitung estimasi volume m3 dan tonase basah.',
  })
  @ApiResponse({ status: 200, description: 'Kalkulasi volumetrik berhasil.' })
  async volumetricAudit(@Body() dto: VolumetricAuditDto) {
    return this.wasteLogService.volumetricAudit(dto);
  }

  @Get('workshop/:workshopId')
  @ApiOperation({
    summary: 'Daftar Residu Limbah Berdasarkan ID Bengkel',
    description: 'Mengambil riwayat pencatatan residu yang pernah didaftarkan oleh bengkel pengrajin.',
  })
  @ApiResponse({ status: 200, description: 'Daftar residu limbah ditemukan.' })
  async findByWorkshop(@Param('workshopId') workshopId: string) {
    return this.wasteLogService.findByWorkshop(workshopId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Ambil Detail Residu Limbah',
    description: 'Mengambil informasi lengkap satu timbulan limbah beserta sertifikat uji laboratorium SNI terkait.',
  })
  @ApiResponse({ status: 200, description: 'Detail limbah ditemukan.' })
  @ApiResponse({ status: 404, description: 'Data limbah tidak ditemukan.' })
  async findOne(@Param('id') id: string) {
    return this.wasteLogService.findOne(id);
  }
}
