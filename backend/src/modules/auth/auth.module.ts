import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt_auth.guards';
import { PrismaService } from 'src/database/prisma.service';
import { PhoneOtpModule } from '../otp/otp.module';
import { ActivityLogModule } from '../user/activity_log.module';

@Module({
  imports: [
    PassportModule,
    PhoneOtpModule,
    ActivityLogModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
<<<<<<< HEAD
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '7d',
          issuer: config.get<string>('JWT_ISSUER') ?? 'mero-bazaar-api',
          audience: config.get<string>('JWT_AUDIENCE') ?? 'mero-bazaar-web',
        },
=======
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '7d' },
>>>>>>> origin/aashika
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, PrismaService],
  exports: [JwtAuthGuard, JwtModule],
})
<<<<<<< HEAD
export class AuthModule {}
=======
export class AuthModule {}
>>>>>>> origin/aashika
