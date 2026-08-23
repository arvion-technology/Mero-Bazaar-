import {
  Controller,
  Post,
  Body,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PhoneOtpService } from './otp.service';
import { VerifyOtpDto } from './dto/verify_otp.dto';
import { SendOtpDto } from './dto/send_otp.dto';
import { InMemoryRateLimiter } from '../../common/utils/rate-limit';
import type { Request } from 'express';

@Controller('otp')
export class PhoneOtpController {
  // Per-IP throttles on top of the per-phone limits inside the service, to stop
  // SMS flooding and OTP guessing from a single source.
  private readonly sendLimiter = new InMemoryRateLimiter(60 * 60 * 1000, 5);
  private readonly verifyLimiter = new InMemoryRateLimiter(15 * 60 * 1000, 10);

  constructor(private phoneOtpService: PhoneOtpService) {}

  @Post('send')
  async send(@Body() dto: SendOtpDto, @Req() req: Request) {
    if (!this.sendLimiter.tryConsume(this.ipKey(req))) {
      throw new HttpException(
        'Too many OTP requests. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    await this.phoneOtpService.sendOtp(dto.phone, dto.context);
    return { message: 'OTP sent successfully.' };
  }

  @Post('verify')
  async verify(@Body() dto: VerifyOtpDto, @Req() req: Request) {
    if (!this.verifyLimiter.tryConsume(this.ipKey(req))) {
      throw new HttpException(
        'Too many verification attempts. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    await this.phoneOtpService.verifyOtp(dto.phone, dto.otp, dto.context);
    return { message: 'Phone verified successfully.' };
  }

  private ipKey(req: Request): string {
    return (
      (req.ip ?? req.socket?.remoteAddress ?? 'unknown') +
      '|' +
      (req.headers['user-agent'] ?? '')
    );
  }
}
