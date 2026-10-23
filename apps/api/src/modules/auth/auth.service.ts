import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../../database/database.service';
import { eq } from 'drizzle-orm';
import { OtpRequestDto } from './dto/otp-request.dto';
import { OtpVerifyDto } from './dto/otp-verify.dto';

interface OtpStoreItem {
  code: string;
  expiresAt: number;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  // Penyimpanan in-memory OTP untuk simulasi gateway WhatsApp OTP
  private readonly otpCache = new Map<string, OtpStoreItem>();

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService
  ) {}

  /**
   * Request OTP via WhatsApp
   */
  async requestOtp(dto: OtpRequestDto) {
    const formattedPhone = this.formatPhoneNumber(dto.phoneNumber);

    // Kode OTP default demo/pengujian: '123456', atau random 6 digit
    const otpCode = process.env.NODE_ENV === 'production' 
      ? Math.floor(100000 + Math.random() * 900000).toString() 
      : '123456';

    const expiresAt = Date.now() + 5 * 60 * 1000; // Berlaku 5 menit
    this.otpCache.set(formattedPhone, { code: otpCode, expiresAt });

    this.logger.log(`[WhatsApp OTP Gateway] Mengirimkan OTP ${otpCode} ke ${formattedPhone}`);

    return {
      phoneNumber: formattedPhone,
      message: 'Kode verifikasi WhatsApp OTP berhasil dikirimkan.',
      expiresInSeconds: 300,
      // Dalam mode dev sertakan debug info agar mudah diuji di Swagger/Postman
      devCode: process.env.NODE_ENV === 'production' ? undefined : otpCode,
    };
  }

  /**
   * Verifikasi OTP & Terbitkan JWT Token
   * Payload memuat: userId, role, workshopId (jika pengrajin), offtakerId (jika industri)
   */
  async verifyOtp(dto: OtpVerifyDto) {
    const formattedPhone = this.formatPhoneNumber(dto.phoneNumber);
    const cached = this.otpCache.get(formattedPhone);

    // Validasi kode OTP (fallback dev: '123456' selalu diterima)
    const isDevBypass = process.env.NODE_ENV !== 'production' && dto.otpCode === '123456';
    const isValid = isDevBypass || (cached && cached.code === dto.otpCode && cached.expiresAt > Date.now());

    if (!isValid) {
      throw new UnauthorizedException('Kode OTP salah atau telah kadaluarsa. Silakan minta kode baru.');
    }

    // Hapus OTP setelah terverifikasi
    this.otpCache.delete(formattedPhone);

    const { db, schema } = this.databaseService;

    // Cari user di database
    const existingUser = await db.query.users.findFirst({
      where: eq(schema.users.phoneNumber, formattedPhone),
      with: {
        workshop: true,
        offtaker: true,
      },
    });

    let userId = existingUser?.id;
    let userPhone = existingUser?.phoneNumber;
    let userRole = existingUser?.role;
    let userName = existingUser?.fullName;
    let workshop = existingUser?.workshop || null;
    let offtaker = existingUser?.offtaker || null;

    // Jika belum terdaftar, buat akun pengrajin default baru
    if (!existingUser) {
      const [newUser] = await db
        .insert(schema.users)
        .values({
          phoneNumber: formattedPhone,
          fullName: 'Pengrajin Baru Tulungagung',
          role: 'pengrajin',
          status: 'active',
        })
        .returning();

      userId = newUser.id;
      userPhone = newUser.phoneNumber;
      userRole = newUser.role;
      userName = newUser.fullName;
      workshop = null;
      offtaker = null;
    }

    const payload = {
      sub: userId,
      userId: userId,
      phoneNumber: userPhone,
      role: userRole,
      fullName: userName,
      workshopId: workshop?.id || null,
      offtakerId: offtaker?.id || null,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      tokenType: 'Bearer',
      user: {
        id: userId,
        phoneNumber: userPhone,
        fullName: userName,
        role: userRole,
        workshop: workshop
          ? {
              id: workshop.id,
              name: workshop.name,
              paguyubanId: workshop.paguyubanId,
              subdistrict: workshop.subdistrict,
              village: workshop.village,
            }
          : null,
        offtaker: offtaker
          ? {
              id: offtaker.id,
              companyName: offtaker.companyName,
              subdistrict: offtaker.subdistrict,
            }
          : null,
      },
    };
  }

  async getProfile(userId: string) {
    const { db, schema } = this.databaseService;

    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, userId),
      with: {
        workshop: {
          with: {
            wallet: true,
          },
        },
        offtaker: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Pengguna tidak ditemukan.');
    }

    return user;
  }

  private formatPhoneNumber(phone: string): string {
    let clean = phone.replace(/\D/g, '');
    if (clean.startsWith('62')) {
      clean = '0' + clean.slice(2);
    } else if (clean.startsWith('+62')) {
      clean = '0' + clean.slice(3);
    }
    return clean;
  }
}
