import { Test, TestingModule } from '@nestjs/testing';
import { VendorKycController } from './vendor-kyc.controller';
import { VendorKycService } from './vendor-kyc.service';

describe('VendorKycController', () => {
  let controller: VendorKycController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendorKycController],
      providers: [{ provide: VendorKycService, useValue: {} }],
    }).compile();

    controller = module.get<VendorKycController>(VendorKycController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
