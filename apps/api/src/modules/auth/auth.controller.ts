import { Controller, Post, Body, Get, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { OtpRequestDto } from './dto/otp-request.dto';
import { OtpVerifyDto } from './dto/otp-verify.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser, AuthUserPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('Auth (Otentikasi OTP WhatsApp)')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('otp-request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Minta Kode OTP WhatsApp',
    description: 'Mengirimkan kode OTP 6 digit ke nomor ponsel WhatsApp pengrajin/mitra.',
  })
  @ApiResponse({ status: 200, description: 'Kode OTP berhasil dikirimkan.' })
  async requestOtp(@Body() dto: OtpRequestDto) {
    return this.authService.requestOtp(dto);
  }

  @Public()
  @Post('otp-verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verifikasi Kode OTP WhatsApp & Dapatkan JWT Token',
    description: 'Memvalidasi kode OTP 6 digit dan menerbitkan JWT accessToken dengan claims role & workshopId.',
  })
  @ApiResponse({ status: 200, description: 'Verifikasi berhasil, token diterbitkan.' })
  @ApiResponse({ status: 401, description: 'Kode OTP salah atau kadaluarsa.' })
  async verifyOtp(@Body() dto: OtpVerifyDto) {
    return this.authService.verifyOtp(dto);
  }

  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Ambil Profil Pengguna Aktif & Bengkel Terkait',
    description: 'Mengembalikan data pengguna, peran, bengkel marmer, dan saldo dompet MUKTI-Pay.',
  })
  @ApiResponse({ status: 200, description: 'Data profil berhasil diambil.' })
  async getProfile(@CurrentUser() user: AuthUserPayload) {
    return this.authService.getProfile(user.userId);
  }
}
