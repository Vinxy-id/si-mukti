import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class CreateWasteLogDto {
  @ApiProperty({
    description: 'Jenis residu limbah marmer',
    enum: ['sludge_lumpur', 'afur_kasar'],
    example: 'sludge_lumpur',
  })
  @IsNotEmpty({ message: 'Jenis limbah wajib dipilih' })
  @IsEnum(['sludge_lumpur', 'afur_kasar'], {
    message: 'Jenis limbah harus sludge_lumpur atau afur_kasar',
  })
  wasteType: 'sludge_lumpur' | 'afur_kasar';

  @ApiProperty({
    description: 'Estimasi volume timbulan limbah dalam meter kubik (m3)',
    example: 2.15,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01, { message: 'Volume minimal 0.01 m3' })
  estimatedVolumeM3: number;

  @ApiProperty({
    description: 'Estimasi berat tonase basah dalam ton (Ton)',
    example: 3.5,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01, { message: 'Tonase minimal 0.01 Ton' })
  estimatedTonnage: number;

  @ApiProperty({
    description: 'URL foto bukti timbulan residu limbah di bengkel pengrajin',
    example: 'https://cdn.si-mukti.tulungagung.go.id/evidence/sludge_barokah_01.jpg',
  })
  @IsNotEmpty({ message: 'Foto bukti limbah wajib diunggah' })
  @IsString()
  photoUrl: string;

  @ApiProperty({
    description: 'Koordinat Lintang Selatan (Latitude) dari auto-capture GPS pengrajin',
    example: -8.1633,
  })
  @IsNotEmpty({ message: 'Koordinat Latitude wajib tercatat' })
  @IsNumber()
  latitude: number;

  @ApiProperty({
    description: 'Koordinat Bujur Timur (Longitude) dari auto-capture GPS pengrajin',
    example: 111.8594,
  })
  @IsNotEmpty({ message: 'Koordinat Longitude wajib tercatat' })
  @IsNumber()
  longitude: number;

  @ApiPropertyOptional({
    description: 'Catatan tambahan pengrajin terkait kondisi residu (misal: telah diendapkan 24 jam)',
    example: 'Sludge basah hasil pembubutan guci marmer putih',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
