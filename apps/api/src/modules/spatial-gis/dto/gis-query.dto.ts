import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class GisActiveWasteQueryDto {
  @ApiPropertyOptional({
    description: 'Koordinat Lintang (Latitude) pusat pencarian radius (default: Campurdarat -8.1633)',
    example: -8.1633,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  targetLat?: number;

  @ApiPropertyOptional({
    description: 'Koordinat Bujur (Longitude) pusat pencarian radius (default: 111.8594)',
    example: 111.8594,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  targetLng?: number;

  @ApiPropertyOptional({
    description: 'Radius filter logistik dalam kilometer (0 - 30 km, default: 15 km)',
    example: 10.0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.5)
  @Max(50.0)
  radiusKm?: number;

  @ApiPropertyOptional({
    description: 'Filter jenis limbah',
    enum: ['sludge_lumpur', 'afur_kasar'],
    example: 'sludge_lumpur',
  })
  @IsOptional()
  @IsEnum(['sludge_lumpur', 'afur_kasar'])
  wasteType?: 'sludge_lumpur' | 'afur_kasar';

  @ApiPropertyOptional({
    description: 'Ambang batas kemurnian kalsit minimum SNI 03-0394 (CaCO3 %)',
    example: 95.0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  minCaco3?: number;
}
