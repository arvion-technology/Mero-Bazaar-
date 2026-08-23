<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'src/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { PhoneOtpService } from 'src/modules/otp/otp.service';
import { ActivityLogService } from 'src/modules/user/activity_log.service';
=======
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
>>>>>>> origin/aashika

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
<<<<<<< HEAD
      providers: [
        UserService,
        { provide: PrismaService, useValue: {} },
        { provide: JwtService, useValue: {} },
        { provide: PhoneOtpService, useValue: {} },
        { provide: ActivityLogService, useValue: {} },
      ],
=======
      providers: [UserService],
>>>>>>> origin/aashika
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
