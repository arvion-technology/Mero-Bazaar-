import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { SparrowSmsService } from './sparrow_sms.service';
import { OtpContext } from "@prisma/client";
import * as bcrypt from 'bcrypt';

@Injectable()
export class PhoneOtpService {
  constructor(
    private prisma: PrismaService,
    private sparrow: SparrowSmsService,
  ) {}

  async sendOtp(phone: string, context: OtpContext): Promise<void> {
    const recentCount = await this.prisma.phoneOtp.count({
        where: {
            phone,
            context,
            createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) },
        },
    });
    if (recentCount >= 3) {
        throw new BadRequestException('Too many OTP requests. Please wait before trying again.',
        );
    }
    await this.prisma.phoneOtp.deleteMany({
      where: { phone, context },
    });
    const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(rawOtp, 10);

    await this.prisma.phoneOtp.create({
      data: {
        phone,
        otpHash: hashedOtp,
        context,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await this.sparrow.send(phone, `Your Mero Bazaar Nepal OTP is ${rawOtp}. Valid for 10 minutes. Do not share it with anyone.`);
  }

  async verifyOtp(phone: string, rawOtp: string, context: OtpContext): Promise<boolean> {
    const record = await this.prisma.phoneOtp.findFirst({
      where: {
        phone,
        context,
        verified: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc',}
    });

    if (!record) {
        throw new NotFoundException('OTP expired or not found. Please request a new one.');
    }

    if (record.attempts >= 5) {
      await this.prisma.phoneOtp.delete({ where: { id: record.id } });
      throw new BadRequestException('Too many failed attempts. Please request a new OTP!');
    }

    const isValid = await bcrypt.compare(rawOtp, record.otpHash);
    if (!isValid) {
      await this.prisma.phoneOtp.update({
        where: { id: record.id },
        data: { attempts: { increment: 1 } },
      });
    throw new BadRequestException('Invalid OTP.');
    }
    await this.prisma.phoneOtp.delete({ where: { id: record.id } });
    return true;
  }
}
