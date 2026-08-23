<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { PhoneOtpService } from './otp.service';
import { PrismaService } from 'src/database/prisma.service';
import { SparrowSmsService } from 'src/modules/otp/sparrow_sms.service';
=======
import { Test, TestingModule } from '@nestjs/testing';
import { PhoneOtpService } from './otp.service';
>>>>>>> origin/aashika

describe('PhoneOtpService', () => {
  let service: PhoneOtpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
<<<<<<< HEAD
      providers: [
        PhoneOtpService,
        { provide: PrismaService, useValue: {} },
        { provide: SparrowSmsService, useValue: {} },
      ],
=======
      providers: [PhoneOtpService],
>>>>>>> origin/aashika
    }).compile();

    service = module.get<PhoneOtpService>(PhoneOtpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
