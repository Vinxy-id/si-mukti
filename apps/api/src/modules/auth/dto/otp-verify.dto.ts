import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class OtpVerifyDto {
  @ApiProperty({
    description: 'Nomor WhatsApp terdaftar',
    example: '081234567801',
  })
  @IsNotEmpty({ message: 'Nomor WhatsApp wajib diisi' })
  @IsString()
  @Matches(/^(?:\+62|62|0)8[1-9][0-9]{6,11}$/, {
    message: 'Format nomor telepon WhatsApp Indonesia tidak valid',
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'Kode OTP 6 Digit yang dikirimkan via WhatsApp (Default Dev: 123456)',
    example: '123456',
  })
  @IsNotEmpty({ message: 'Kode OTP wajib diisi' })
  @IsString()
  @Length(6, 6, { message: 'Kode OTP harus tepat 6 digit angka' })
  otpCode: string;
}
