import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { PhoneOtpService } from 'src/modules/otp/otp.service';
import { ActivityLogService } from 'src/modules/user/activity_log.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: {} },
        { provide: JwtService, useValue: {} },
        { provide: PhoneOtpService, useValue: {} },
        { provide: ActivityLogService, useValue: {} },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
