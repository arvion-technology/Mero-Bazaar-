import { Test, TestingModule } from '@nestjs/testing';
import { PhoneOtpController } from './otp.controller';
import { PhoneOtpService } from './otp.service';

describe('PhoneOtpController', () => {
  let controller: PhoneOtpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhoneOtpController],
      providers: [{ provide: PhoneOtpService, useValue: {} }],
    }).compile();

    controller = module.get<PhoneOtpController>(PhoneOtpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
