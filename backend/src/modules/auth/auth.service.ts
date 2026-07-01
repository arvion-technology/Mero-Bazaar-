import { ConflictException, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { randomBytes } from 'crypto';
import type { Request } from 'express';
import { PhoneOtpService } from '../otp/otp.service';
import { OtpContext } from '@prisma/client';

function parseUserAgent(ua?: string): string {
  if (!ua) return 'Unknown device';
  const browser = /Edg\//.test(ua) ? 'Edge' : /Chrome\//.test(ua) ? 'Chrome' : /Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Browser';
  const os = /Windows/.test(ua) ? 'Windows' : /Mac OS/.test(ua) ? 'macOS' : /Android/.test(ua) ? 'Android' : /iPhone|iPad/.test(ua) ? 'iOS' : /Linux/.test(ua) ? 'Linux' : 'Unknown OS';
  return `${browser} on ${os}`;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private phoneOtpService: PhoneOtpService,
  ) {}

  async register(dto: RegisterDto, req: Request) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email already in use');

    if(dto.phone) {
      const phoneExists = await this.prisma.user.findUnique({
        where: { phone: dto.phone },
      });
      if (phoneExists) throw new ConflictException('Phone number already in use');
    }
    const hash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
        name: dto.name,
        phone: dto.phone,
        role: dto.role ?? UserRole.USER,
        address: dto.address,

        ...(dto.role === UserRole.VENDOR && {
          vendorProfile: {
            create: {
              businessName: dto.name ?? '',
              businessType: 'INDIVIDUAL',
            },
          },
        }),
      },
    });

    return this.signToken(user.id, user.email, user.role ?? UserRole.USER,req);
  }

  async login(dto: LoginDto, req: Request) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException('User not found');

    if (!user.password) {
      throw new UnauthorizedException(
        "This account uses Google/Facebook login. Please continue with OAuth."
      );
    }
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials!');

    // NEW: 2FA gate
    if (user.twoFactorEnabled) {
      if (!user.phone) {
        throw new ForbiddenException('Two-factor is enabled but no verified phone is on file.');
      }
      await this.phoneOtpService.sendOtp(user.phone, OtpContext.LOGIN);
      const tempToken = this.jwtService.sign(
        { sub: user.id, purpose: 'login_2fa' },
        { expiresIn: '5m' },
      );
      return { requiresTwoFactor: true, tempToken };
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });
    return this.signToken(user.id, user.email, user.role ?? UserRole.USER, req);
  }

    async verifyLoginOtp(tempToken: string, otp: string, req: Request) {
    let payload: { sub: string; purpose: string };
    try {
      payload = this.jwtService.verify(tempToken);
    } catch {
      throw new UnauthorizedException('Login session expired. Please log in again.');
    }
    if (payload.purpose !== 'login_2fa') {
      throw new UnauthorizedException('Invalid token.');
    }

    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user?.phone) throw new UnauthorizedException('User not found');

    await this.phoneOtpService.verifyOtp(user.phone, otp, OtpContext.LOGIN);

    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    return this.signToken(user.id, user.email, user.role ?? UserRole.USER, req);
  }

  async logout(userId: string, sessionId?: string) {
    if (sessionId) {
      await this.prisma.session.updateMany({
        where: { id: sessionId, userId },
        data: { revokedAt: new Date() },
      });
    }
    return { message: 'Logged out successfully!' };
  }

  private async signToken(userId: string, email: string, role: UserRole, req: Request) {
    console.log('>>> signToken called for userId:', userId);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const opaqueSecret = randomBytes(32).toString('hex');
    const refreshTokenHash = await bcrypt.hash(opaqueSecret, 10);

    const session = await this.prisma.session.create({
      data: {
        userId,
        refreshTokenHash,
        expiresAt,
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
        deviceLabel: parseUserAgent(req.headers['user-agent']),
      },
    });

    console.log('>>> session created with id:', session.id);

    return {
      access_token: this.jwtService.sign({ sub: userId, email, role, sid: session.id }),
      user: { id: userId, email, role },
    };
  }
} 