import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CompleteStopDto {
  @ApiProperty({
    description: 'Bobot timbangan riil muatan yang ditimbang di lokasi bengkel dalam kilogram (kg)',
    example: 3500.0,
  })
  @IsNotEmpty({ message: 'Bobot timbangan riil wajib diisi' })
  @IsNumber()
  @Min(100, { message: 'Bobot muatan minimal 100 kg' })
  measuredWeightKg: number;

  @ApiPropertyOptional({
    description: 'URL foto struk timbangan jembatan / timbang gantung digital',
    example: 'https://cdn.si-mukti.tulungagung.go.id/slip/weigh_slip_0089_1.jpg',
  })
  @IsOptional()
  @IsString()
  weighingSlipPhotoUrl?: string;

  @ApiPropertyOptional({
    description: 'Catatan sopir terkait kondisi jalan atau muatan saat serah terima',
    example: 'Muatan sludge padat telah diangkut dengan aman, bak tertutup terpal',
  })
  @IsOptional()
  @IsString()
  driverNotes?: string;
}
