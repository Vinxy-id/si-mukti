import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class OtpRequestDto {
  @ApiProperty({
    description: 'Nomor WhatsApp aktif pengguna UMKM / Mitra (contoh: 081234567801 untuk Pak Supardi)',
    example: '081234567801',
  })
  @IsNotEmpty({ message: 'Nomor WhatsApp wajib diisi' })
  @IsString()
  @Matches(/^(?:\+62|62|0)8[1-9][0-9]{6,11}$/, {
    message: 'Format nomor telepon WhatsApp Indonesia tidak valid',
  })
  phoneNumber: string;
}
