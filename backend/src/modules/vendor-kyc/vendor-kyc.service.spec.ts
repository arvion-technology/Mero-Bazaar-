import { Test, TestingModule } from '@nestjs/testing';
import { VendorKycService } from './vendor-kyc.service';

describe('VendorKycService', () => {
  let service: VendorKycService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VendorKycService],
    }).compile();

    service = module.get<VendorKycService>(VendorKycService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
