import { Test, TestingModule } from '@nestjs/testing';
import { PhoneOtpController } from './otp.controller';

describe('PhoneOtpController', () => {
  let controller: PhoneOtpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhoneOtpController],
    }).compile();

    controller = module.get<PhoneOtpController>(PhoneOtpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
