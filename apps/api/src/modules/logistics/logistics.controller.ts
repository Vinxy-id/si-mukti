import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LogisticsService } from './logistics.service';
import { DispatchOrderDto } from './dto/dispatch-order.dto';
import { CompleteStopDto } from './dto/complete-stop.dto';
import { CurrentUser, AuthUserPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('Logistics (Armada Truk & Multi-Stop Dispatch)')
@ApiBearerAuth('JWT-auth')
@Controller('logistics')
export class LogisticsController {
  constructor(private readonly logisticsService: LogisticsService) {}

  @Post('dispatch')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Tugaskan Armada Penjemputan Multi-Stop (Dispatch Truk)',
    description: 'Offtaker menugaskan armada truk dump untuk menjemput residu limbah pada beberapa bengkel secara berurutan dan menerbitkan e-Manifest.',
  })
  @ApiResponse({ status: 201, description: 'Penugasan armada berhasil dibuat.' })
  async dispatch(
    @Body() dto: DispatchOrderDto,
    @CurrentUser() user: AuthUserPayload
  ) {
    return this.logisticsService.dispatchOrder(dto, user);
  }

  @Patch('stops/:id/complete')
  @ApiOperation({
    summary: 'Selesaikan Timbang Muat Stop & Picu Kredit Saldo MUKTI-Pay',
    description: 'Sopir menyelesaikan muat timbangan di bengkel. Sistem otomatis mengkredit saldo dompet pengrajin (bobot riil x tarif) secara instan.',
  })
  @ApiResponse({ status: 200, description: 'Timbang muat selesai, saldo pengrajin dikreditkan.' })
  async completeStop(
    @Param('id') stopId: string,
    @Body() dto: CompleteStopDto
  ) {
    return this.logisticsService.completeStop(stopId, dto);
  }

  @Get('orders')
  @ApiOperation({
    summary: 'Daftar Semua Order Penjemputan Armada',
    description: 'Mengambil riwayat dan status penugasan armada truk di sentra Campurdarat & Besole.',
  })
  @ApiResponse({ status: 200, description: 'Daftar order penjemputan berhasil diambil.' })
  async getOrders() {
    return this.logisticsService.getOrders();
  }

  @Get('orders/:id')
  @ApiOperation({
    summary: 'Detail Order Penjemputan & Urutan Titik Singgah (Stops)',
    description: 'Mengambil detail satu pesanan truk lengkap dengan titik singgah dan status timbangan riil.',
  })
  @ApiResponse({ status: 200, description: 'Detail pesanan ditemukan.' })
  @ApiResponse({ status: 404, description: 'Pesanan tidak ditemukan.' })
  async getOrderById(@Param('id') id: string) {
    return this.logisticsService.getOrderById(id);
  }
}
