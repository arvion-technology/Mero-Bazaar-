import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/database/prisma.service';

<<<<<<< HEAD
interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  sid: string;
  purpose?: string;
}

=======
>>>>>>> origin/aashika
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    const secret = process.env.JWT_SECRET;
<<<<<<< HEAD
    if (!secret || secret.length < 32) {
      throw new Error(
        'JWT_SECRET is missing or too short (need 32+ chars of entropy). Refusing to start.',
      );
=======
    if (!secret) {
      throw new Error('JWT_SECRET is not configured.');
>>>>>>> origin/aashika
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
      algorithms: ['HS256'],
<<<<<<< HEAD
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
=======
    });
  }

  async validate(payload: { sub: string; email: string; sid: string }) {
    if (!payload.sid) {
      throw new UnauthorizedException('Token missing session id');
    }
>>>>>>> origin/aashika

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException();
    }
<<<<<<< HEAD

=======
    
>>>>>>> origin/aashika
    const session = await this.prisma.session.findUnique({
      where: { id: payload.sid },
    });

<<<<<<< HEAD
    // The session must exist, belong to the token subject, be unrevoked and unexpired.
    if (
      !session ||
      session.userId !== user.id ||
      session.revokedAt ||
      session.expiresAt < new Date()
    ) {
=======
    if (!session || session.revokedAt || session.expiresAt < new Date()) {
>>>>>>> origin/aashika
      throw new UnauthorizedException('Session has been revoked');
    }

    this.prisma.session
<<<<<<< HEAD
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
=======
    .update({ where: { id: payload.sid }, data: { lastActiveAt: new Date() } })
    .catch(() => {});
  return { id: user.id, email: user.email, role: user.role, sessionId: payload.sid };
>>>>>>> origin/aashika
  }
}
