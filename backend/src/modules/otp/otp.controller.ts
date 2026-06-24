import { Controller, Post, Body } from '@nestjs/common';
import { PhoneOtpService } from './otp.service';
import { VerifyOtpDto } from './dto/verify_otp.dto';
import { SendOtpDto } from './dto/send_otp.dto';

@Controller('otp')
export class PhoneOtpController {
  constructor(private phoneOtpService: PhoneOtpService) {}

  @Post('send')
  async send(@Body() dto: SendOtpDto) {
    await this.phoneOtpService.sendOtp(dto.phone, dto.context);
    return { message: 'OTP sent successfully.'};
  }

  @Post('verify')
  async verify(@Body() dto: VerifyOtpDto) {
    await this.phoneOtpService.verifyOtp(dto.phone, dto.otp, dto.context);
    return { message: 'Phone verified successfully.'};
  }
}
