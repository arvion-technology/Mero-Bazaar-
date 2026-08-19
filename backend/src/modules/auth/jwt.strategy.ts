import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not configured.');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
      algorithms: ['HS256'],
    });
  }

  async validate(payload: { sub: string; email: string; sid: string }) {
    if (!payload.sid) {
      throw new UnauthorizedException('Token missing session id');
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

    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Session has been revoked');
    }

    this.prisma.session
    .update({ where: { id: payload.sid }, data: { lastActiveAt: new Date() } })
    .catch(() => {});
  return { id: user.id, email: user.email, role: user.role, sessionId: payload.sid };
  }
}
