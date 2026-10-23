import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class VolumetricAuditDto {
  @ApiProperty({
    description: 'URL foto atau preview base64 penampung limbah untuk analisis volumetrik kamera computer vision',
    example: 'https://cdn.si-mukti.tulungagung.go.id/evidence/sludge_barokah_01.jpg',
  })
  @IsNotEmpty({ message: 'Foto limbah wajib disertakan untuk audit volumetrik AI' })
  @IsString()
  photoUrl: string;

  @ApiProperty({
    description: 'Klasifikasi residu yang diaudit',
    enum: ['sludge_lumpur', 'afur_kasar'],
    example: 'sludge_lumpur',
  })
  @IsNotEmpty()
  @IsEnum(['sludge_lumpur', 'afur_kasar'])
  wasteType: 'sludge_lumpur' | 'afur_kasar';

  @ApiPropertyOptional({
    description: 'Jenis wadah penampung di bengkel pengrajin',
    enum: ['bak_terpal_kotak', 'drum_besi_silinder', 'tumpukan_tanah_terpal'],
    example: 'bak_terpal_kotak',
  })
  @IsOptional()
  @IsString()
  containerType?: string;

  @ApiPropertyOptional({
    description: 'Estimasi jarak kamera ke objek limbah dalam meter (default: 1.5m)',
    example: 1.5,
  })
  @IsOptional()
  @IsNumber()
  cameraDistanceMeters?: number;
}
