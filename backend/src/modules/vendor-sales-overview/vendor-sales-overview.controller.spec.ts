<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { VendorSalesOverviewController } from './vendor-sales-overview.controller';
import { VendorSalesOverviewService } from './vendor-sales-overview.service';
=======
import { Test, TestingModule } from '@nestjs/testing';
import { VendorSalesOverviewController } from './vendor-sales-overview.controller';
>>>>>>> origin/aashika

describe('VendorSalesOverviewController', () => {
  let controller: VendorSalesOverviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendorSalesOverviewController],
<<<<<<< HEAD
      providers: [{ provide: VendorSalesOverviewService, useValue: {} }],
    }).compile();

    controller = module.get<VendorSalesOverviewController>(
      VendorSalesOverviewController,
    );
=======
    }).compile();

    controller = module.get<VendorSalesOverviewController>(VendorSalesOverviewController);
>>>>>>> origin/aashika
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
