import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/database/prisma.service';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  sid: string;
  purpose?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
      throw new Error(
        'JWT_SECRET is missing or too short (need 32+ chars of entropy). Refusing to start.',
      );
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
      algorithms: ['HS256'],
      issuer: process.env.JWT_ISSUER ?? 'mero-bazaar-api',
      audience: process.env.JWT_AUDIENCE ?? 'mero-bazaar-web',
    });
  }

  async validate(payload: JwtPayload) {
    // The 2FA hand-off token (purpose=login_2fa) is NOT an access token: it is
    // signed without a session id and must never be accepted as a bearer token.
    if (!payload.sid) {
      throw new UnauthorizedException('Token missing session id');
    }
    if (payload.purpose && payload.purpose !== 'access') {
      throw new UnauthorizedException('Token is not an access token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException();
    }

    const session = await this.prisma.session.findUnique({
      where: { id: payload.sid },
    });

    // The session must exist, belong to the token subject, be unrevoked and unexpired.
    if (
      !session ||
      session.userId !== user.id ||
      session.revokedAt ||
      session.expiresAt < new Date()
    ) {
      throw new UnauthorizedException('Session has been revoked');
    }

    this.prisma.session
      .update({
        where: { id: payload.sid },
        data: { lastActiveAt: new Date() },
      })
      .catch(() => {});
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      sessionId: payload.sid,
    };
  }
}
