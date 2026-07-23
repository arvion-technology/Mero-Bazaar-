import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: { sub: string; email: string; sid?: string }) {
    console.log('>>> JWT validate payload:', payload);
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.isActive) {
      console.log('>>> failed: no user or inactive');
      throw new UnauthorizedException();
    }
    if (payload.sid) {
      const session = await this.prisma.session.findUnique({ where: { id: payload.sid } });
      if (!session || session.revokedAt || session.expiresAt < new Date()) {
        console.log('>>> failed: session issue', { found: !!session, revokedAt: session?.revokedAt, expired: session ? session.expiresAt < new Date() : null });
        throw new UnauthorizedException('Session has been revoked');
      }
      this.prisma.session
      .update({ where: { id: payload.sid }, data: { lastActiveAt: new Date() } })
      .catch(() => {});
    }
    return { id: user.id, email: user.email, role: user.role, sessionId: payload.sid };
  }
}