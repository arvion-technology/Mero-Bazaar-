import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UserService } from './user.service';
import { PrismaService } from 'src/database/prisma.service';
import { UserController } from './user.controller';
import { PhoneOtpModule } from '../otp/otp.module';

@Module({
  imports: [AuthModule, PhoneOtpModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
