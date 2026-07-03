import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt_auth.guards';
import type { Request } from 'express';
import { VerifyLoginOtpDto } from './dto/verify_login_otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto, @Req() req: Request) {
    return this.authService.register(dto, req);
  }

  @Post('login')
  login(@Body() dto: LoginDto, @Req() req: Request) {
    return this.authService.login(dto, req);
  }

  @Post('2fa/verify')
  verifyTwoFactor(@Body() dto: VerifyLoginOtpDto, @Req() req: Request) {
    return this.authService.verifyLoginOtp(dto.tempToken, dto.otp, req);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() req: Request & { user: { id: string; sessionId?: string } }) {
    return this.authService.logout(req.user.id, req.user.sessionId);
  }
}