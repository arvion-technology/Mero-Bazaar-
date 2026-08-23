<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { PhoneOtpController } from './otp.controller';
import { PhoneOtpService } from './otp.service';
=======
import { Test, TestingModule } from '@nestjs/testing';
import { PhoneOtpController } from './otp.controller';
>>>>>>> origin/aashika

describe('PhoneOtpController', () => {
  let controller: PhoneOtpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhoneOtpController],
<<<<<<< HEAD
      providers: [{ provide: PhoneOtpService, useValue: {} }],
=======
>>>>>>> origin/aashika
    }).compile();

    controller = module.get<PhoneOtpController>(PhoneOtpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
