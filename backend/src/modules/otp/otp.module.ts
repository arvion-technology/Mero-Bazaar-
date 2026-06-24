import { Module } from '@nestjs/common';
import { PhoneOtpService } from './otp.service';
import { PhoneOtpController } from './otp.controller';
import { SparrowSmsService } from './sparrow_sms.service';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PhoneOtpService, SparrowSmsService],
  controllers: [PhoneOtpController],
  exports: [PhoneOtpService, SparrowSmsService],
})
export class PhoneOtpModule {}
