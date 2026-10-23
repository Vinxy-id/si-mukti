import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { WithdrawDto } from './dto/withdraw.dto';

@ApiTags('Wallet (Dompet MUKTI-Pay & Pencairan Bank Jatim)')
@ApiBearerAuth('JWT-auth')
@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get(':workshopId')
  @ApiOperation({
    summary: 'Ambil Saldo & Statistik Dompet MUKTI-Pay',
    description: 'Menampilkan saldo aktif, total insentif yang diperoleh, total pencairan, serta 10 mutasi transaksi terakhir.',
  })
  @ApiResponse({ status: 200, description: 'Data dompet berhasil diambil.' })
  async getWallet(@Param('workshopId') workshopId: string) {
    return this.walletService.getWallet(workshopId);
  }

  @Post(':workshopId/withdraw')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Ajukan Pencairan Saldo ke Rekening Bank Jatim / BRI',
    description: 'Mengajukan pencairan dana insentif valorisasi marmer langsung ke nomor rekening terdaftar pengrajin.',
  })
  @ApiResponse({ status: 200, description: 'Pengajuan pencairan saldo berhasil diproses.' })
  @ApiResponse({ status: 400, description: 'Saldo tidak mencukupi atau nominal tidak valid.' })
  async requestWithdrawal(
    @Param('workshopId') workshopId: string,
    @Body() dto: WithdrawDto
  ) {
    return this.walletService.requestWithdrawal(workshopId, dto);
  }

  @Get(':workshopId/transactions')
  @ApiOperation({
    summary: 'Riwayat Lengkap Buku Mutasi Transaksi Dompet',
    description: 'Daftar riwayat seluruh kredit insentif penjemputan limbah dan debet penarikan rekening.',
  })
  @ApiResponse({ status: 200, description: 'Riwayat mutasi berhasil diambil.' })
  async getTransactions(@Param('workshopId') workshopId: string) {
    return this.walletService.getTransactions(workshopId);
  }
}
