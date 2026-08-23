<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { VendorKycController } from './vendor-kyc.controller';
import { VendorKycService } from './vendor-kyc.service';
=======
import { Test, TestingModule } from '@nestjs/testing';
import { VendorKycController } from './vendor-kyc.controller';
>>>>>>> origin/aashika

describe('VendorKycController', () => {
  let controller: VendorKycController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendorKycController],
<<<<<<< HEAD
      providers: [{ provide: VendorKycService, useValue: {} }],
=======
>>>>>>> origin/aashika
    }).compile();

    controller = module.get<VendorKycController>(VendorKycController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
