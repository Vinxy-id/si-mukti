import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class WithdrawDto {
  @ApiProperty({
    description: 'Nominal saldo MUKTI-Pay yang ingin ditarik ke rekening bank (minimal Rp 50.000)',
    example: 500000,
  })
  @IsNotEmpty({ message: 'Nominal pencairan wajib diisi' })
  @IsNumber()
  @Min(50000, { message: 'Nominal penarikan saldo minimal Rp 50.000' })
  amount: number;

  @ApiPropertyOptional({
    description: 'Nama bank tujuan penarikan (default: Bank Jatim)',
    example: 'Bank Jatim',
  })
  @IsOptional()
  @IsString()
  bankTarget?: string;

  @ApiPropertyOptional({
    description: 'Nomor rekening bank tujuan (default: rekening terdaftar pengrajin)',
    example: '0182390123',
  })
  @IsOptional()
  @IsString()
  accountTarget?: string;
}
