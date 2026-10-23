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
import { PassportTraceService } from './passport-trace.service';
import { CreatePassportDto } from './dto/create-passport.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser, AuthUserPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('Passport Trace (Paspor Digital & Verifikasi Keaslian QR)')
@Controller('passports')
export class PassportTraceController {
  constructor(private readonly passportTraceService: PassportTraceService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Terbitkan Paspor Digital Produk Marmer Baru (MUKTI-Trace)',
    description: 'Pengrajin mendaftarkan karya produk marmer, menghitung kalkulasi zero-waste, menghasilkan SHA-256 hash dan segel QR Code terverifikasi.',
  })
  @ApiResponse({ status: 201, description: 'Paspor digital marmer berhasil diterbitkan.' })
  async createPassport(
    @Body() dto: CreatePassportDto,
    @CurrentUser() user: AuthUserPayload
  ) {
    return this.passportTraceService.createPassport(dto, user);
  }

  @Public()
  @Get('verify/:hash')
  @ApiOperation({
    summary: 'Verifikasi Publik Keaslian Produk Marmer (< 50ms, Bebas Auth)',
    description: 'Halaman publik yang dipanggil kamera konsumen saat memindai QR Code. Menampilkan sertifikasi asal kuari, uji spektrometri SNI, linimasa pengrajin, dan komparasi terhadap marmer sintetis.',
  })
  @ApiResponse({ status: 200, description: 'Status keaslian marmer terverifikasi 100%.' })
  @ApiResponse({ status: 404, description: 'Paspor tidak ditemukan / produk palsu tidak terdaftar.' })
  async verifyPassport(@Param('hash') hash: string) {
    return this.passportTraceService.verifyPassport(hash);
  }

  @Get('workshop/:workshopId')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Daftar Paspor Digital yang Diterbitkan Bengkel Tertentu',
    description: 'Mengambil riwayat katalog produk bersertifikasi milik pengrajin.',
  })
  @ApiResponse({ status: 200, description: 'Daftar paspor marmer ditemukan.' })
  async findByWorkshop(@Param('workshopId') workshopId: string) {
    return this.passportTraceService.findByWorkshop(workshopId);
  }
}
