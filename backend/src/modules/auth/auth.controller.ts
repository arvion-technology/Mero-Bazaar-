<<<<<<< HEAD
﻿import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
=======
import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
>>>>>>> origin/aashika
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt_auth.guards';
import type { Request } from 'express';
import { VerifyLoginOtpDto } from './dto/verify_login_otp.dto';
<<<<<<< HEAD
import { InMemoryRateLimiter } from '../../common/utils/rate-limit';

@Controller('auth')
export class AuthController {
  // Per-IP throttles: password guessing, account-state enumeration, resource abuse.
  private readonly loginLimiter = new InMemoryRateLimiter(15 * 60 * 1000, 10);
  private readonly registerLimiter = new InMemoryRateLimiter(
    60 * 60 * 1000,
    10,
  );
  private readonly twoFactorLimiter = new InMemoryRateLimiter(
    15 * 60 * 1000,
    10,
  );

=======

@Controller('auth')
export class AuthController {
>>>>>>> origin/aashika
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto, @Req() req: Request) {
<<<<<<< HEAD
    if (!this.registerLimiter.tryConsume(this.ipKey(req))) {
      throw new HttpException(
        'Too many registration attempts. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
=======
>>>>>>> origin/aashika
    return this.authService.register(dto, req);
  }

  @Post('login')
  login(@Body() dto: LoginDto, @Req() req: Request) {
<<<<<<< HEAD
    if (!this.loginLimiter.tryConsume(this.ipKey(req))) {
      throw new HttpException(
        'Too many login attempts. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
=======
>>>>>>> origin/aashika
    return this.authService.login(dto, req);
  }

  @Post('2fa/verify')
  verifyTwoFactor(@Body() dto: VerifyLoginOtpDto, @Req() req: Request) {
<<<<<<< HEAD
    if (!this.twoFactorLimiter.tryConsume(this.ipKey(req))) {
      throw new HttpException(
        'Too many attempts. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
=======
>>>>>>> origin/aashika
    return this.authService.verifyLoginOtp(dto.tempToken, dto.otp, req);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() req: Request & { user: { id: string; sessionId?: string } }) {
    return this.authService.logout(req.user.id, req.user.sessionId);
  }
<<<<<<< HEAD

  private ipKey(req: Request): string {
    return (
      (req.ip ?? req.socket?.remoteAddress ?? 'unknown') +
      '|' +
      (req.headers['user-agent'] ?? '')
    );
  }
}
=======
}
>>>>>>> origin/aashika
