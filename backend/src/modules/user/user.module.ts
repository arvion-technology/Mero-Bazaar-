import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UserService } from './user.service';
import { PrismaService } from 'src/database/prisma.service';
import { UserController } from './user.controller';
import { PhoneOtpModule } from '../otp/otp.module';
import { ActivityLogService } from './activity_log.service';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [AuthModule, PhoneOtpModule, PrismaModule],
  controllers: [UserController],
  providers: [UserService, PrismaService, ActivityLogService],
  exports: [UserService, ActivityLogService],
})
export class UserModule {}
