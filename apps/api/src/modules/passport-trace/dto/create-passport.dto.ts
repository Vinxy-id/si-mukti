import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreatePassportDto {
  @ApiProperty({
    description: 'Nama produk kerajinan marmer alam asli',
    example: 'Meja Bundar Solid Onyx Tulungagung',
  })
  @IsNotEmpty({ message: 'Nama produk wajib diisi' })
  @IsString()
  productName: string;

  @ApiProperty({
    description: 'Kategori produk',
    example: 'Furniture & Dekorasi Interior',
  })
  @IsNotEmpty({ message: 'Kategori produk wajib diisi' })
  @IsString()
  productCategory: string;

  @ApiProperty({
    description: 'Dimensi spesifikasi produk fisik (P x L x T / Diameter)',
    example: 'D: 120cm x T: 75cm, Tebal Slab: 4cm',
  })
  @IsNotEmpty({ message: 'Dimensi produk wajib diisi' })
  @IsString()
  dimensions: string;

  @ApiProperty({
    description: 'Berat produk jadi dalam kilogram (kg)',
    example: 185.0,
  })
  @IsNotEmpty({ message: 'Berat produk wajib diisi' })
  @IsNumber()
  @Min(0.5, { message: 'Berat produk minimal 0.5 kg' })
  weightKg: number;

  @ApiProperty({
    description: 'URL foto resolusi tinggi produk marmer asli setelah selesai pemolesan',
    example: 'https://cdn.si-mukti.tulungagung.go.id/products/meja_onyx_supardi.jpg',
  })
  @IsNotEmpty({ message: 'Foto produk wajib diunggah' })
  @IsString()
  finishedPhotoUrl: string;

  @ApiPropertyOptional({
    description: 'ID Bongkahan Kuari Tambang Karst Asal (opsional, akan otomatis dipasangkan dengan kuari terverifikasi terdekat)',
    example: 'q1111111-qqqq-qqqq-qqqq-qqqqqqqqqqqq',
  })
  @IsOptional()
  @IsUUID('4')
  quarryBlockId?: string;

  @ApiPropertyOptional({
    description: 'ID Sertifikat Uji Laboratorium Spektrometri SNI 03-0394',
    example: 'e1111111-eeee-eeee-eeee-eeeeeeeeeeee',
  })
  @IsOptional()
  @IsUUID('4')
  labTestReportId?: string;
}
