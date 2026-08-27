import { Test, TestingModule } from '@nestjs/testing';
import { PhoneOtpService } from './otp.service';
import { PrismaService } from 'src/database/prisma.service';
import { SparrowSmsService } from 'src/modules/otp/sparrow_sms.service';

describe('PhoneOtpService', () => {
  let service: PhoneOtpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhoneOtpService,
        { provide: PrismaService, useValue: {} },
        { provide: SparrowSmsService, useValue: {} },
      ],
    }).compile();

    service = module.get<PhoneOtpService>(PhoneOtpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
