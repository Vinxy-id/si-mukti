import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsDateString, IsNotEmpty, IsUUID } from 'class-validator';

export class DispatchOrderDto {
  @ApiProperty({
    description: 'ID Armada Truk Dump Offtaker yang ditugaskan',
    example: 'c1111111-cccc-cccc-cccc-cccccccccccc',
  })
  @IsNotEmpty({ message: 'Armada truk wajib dipilih' })
  @IsUUID('4', { message: 'ID kendaraan harus format UUID v4' })
  vehicleId: string;

  @ApiProperty({
    description: 'Jadwal tanggal dan jam penjemputan armada',
    example: '2026-10-23T08:00:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  scheduledPickupDate: string;

  @ApiProperty({
    description: 'Daftar ID Residu Limbah yang akan dijemput berurutan (Multi-Stop TSP Sequence)',
    example: [
      'd1111111-dddd-dddd-dddd-dddddddddddd',
      'd2222222-dddd-dddd-dddd-dddddddddddd',
    ],
  })
  @IsArray()
  @ArrayNotEmpty({ message: 'Minimal pilih 1 titik residu limbah untuk dijemput' })
  @IsUUID('4', { each: true, message: 'Setiap ID limbah harus format UUID v4' })
  wasteLogIds: string[];
}
