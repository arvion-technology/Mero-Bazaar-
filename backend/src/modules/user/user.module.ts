import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UserService } from './user.service';
import { PrismaService } from 'src/database/prisma.service';
import { UserController } from './user.controller';
import { PhoneOtpModule } from '../otp/otp.module';
import { PrismaModule } from 'src/database/prisma.module';
import { ActivityLogModule } from './activity_log.module';

@Module({
  imports: [AuthModule, PhoneOtpModule, PrismaModule, ActivityLogModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService, ActivityLogModule],
})
export class UserModule {}
