import { Test, TestingModule } from '@nestjs/testing';
import { PhoneOtpService } from './otp.service';

describe('PhoneOtpService', () => {
  let service: PhoneOtpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhoneOtpService],
    }).compile();

    service = module.get<PhoneOtpService>(PhoneOtpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
