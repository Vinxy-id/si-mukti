import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DatabaseService } from '../../../database/database.service';
import { eq } from 'drizzle-orm';
import { AuthUserPayload } from '../../../common/decorators/current-user.decorator';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly databaseService: DatabaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'mukti_jwt_secret_auth_token_tulungagung_2026',
    });
  }

  async validate(payload: any): Promise<AuthUserPayload> {
    const { sub: userId } = payload;
    const { db, schema } = this.databaseService;

    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, userId),
      with: {
        workshop: true,
        offtaker: true,
      },
    });

    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('Sesi otentikasi tidak valid atau akun dinonaktifkan.');
    }

    return {
      userId: user.id,
      role: user.role,
      phoneNumber: user.phoneNumber,
      fullName: user.fullName,
      workshopId: user.workshop?.id || null,
      offtakerId: user.offtaker?.id || null,
    };
  }
}
