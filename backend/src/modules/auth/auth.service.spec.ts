<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { PhoneOtpService } from 'src/modules/otp/otp.service';
import { ActivityLogService } from 'src/modules/user/activity_log.service';
=======
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
>>>>>>> origin/aashika

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
<<<<<<< HEAD
      providers: [
        AuthService,
        { provide: PrismaService, useValue: {} },
        { provide: JwtService, useValue: {} },
        { provide: PhoneOtpService, useValue: {} },
        { provide: ActivityLogService, useValue: {} },
      ],
=======
      providers: [AuthService],
>>>>>>> origin/aashika
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
