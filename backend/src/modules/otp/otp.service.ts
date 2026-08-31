import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { SparrowSmsService } from './sparrow_sms.service';
import { OtpContext } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';

const MAX_OTP_PER_PHONE_PER_HOUR = 3;
const MAX_ATTEMPTS = 5;

@Injectable()
export class PhoneOtpService {
  constructor(
    private prisma: PrismaService,
    private sparrow: SparrowSmsService,
  ) {}

  async sendOtp(phone: string, context: OtpContext): Promise<void> {
    // Rate limit by phone + context within a fixed window (history is never erased).
    const recentCount = await this.prisma.phoneOtp.count({
      where: {
        phone,
        context,
        createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) },
      },
    });
    if (recentCount >= MAX_OTP_PER_PHONE_PER_HOUR) {
      throw new BadRequestException(
        'Too many OTP requests. Please wait before trying again.',
      );
    }

    // Cryptographically secure 6-digit code — never Math.random().
    const rawOtp = randomInt(0, 1000000).toString().padStart(6, '0');
    const hashedOtp = await bcrypt.hash(rawOtp, 10);

    await this.prisma.phoneOtp.create({
      data: {
        phone,
        otpHash: hashedOtp,
        context,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await this.sparrow.send(
      phone,
      `Your Mero Bazaar Nepal OTP is ${rawOtp}. Valid for 10 minutes. Do not share it with anyone.`,
    );
  }

  async verifyOtp(
    phone: string,
    rawOtp: string,
    context: OtpContext,
  ): Promise<boolean> {
    const record = await this.prisma.phoneOtp.findFirst({
      where: {
        phone,
        context,
        verified: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      throw new NotFoundException(
        'OTP expired or not found. Please request a new one.',
      );
    }

    // Atomic attempt guard: only one concurrent request may consume an attempt slot,
    // so parallel guessing cannot share a stale attempt counter.
    const consumed = await this.prisma.phoneOtp.updateMany({
      where: { id: record.id, attempts: { lt: MAX_ATTEMPTS } },
      data: { attempts: { increment: 1 } },
    });

    if (consumed.count === 0) {
      await this.prisma.phoneOtp.delete({ where: { id: record.id } });
      throw new BadRequestException(
        'Too many failed attempts. Please request a new OTP!',
      );
    }

    const isValid = await bcrypt.compare(rawOtp, record.otpHash);
    if (!isValid) {
      throw new BadRequestException('Invalid OTP.');
    }

    await this.prisma.phoneOtp.delete({ where: { id: record.id } });
    return true;
  }
}
