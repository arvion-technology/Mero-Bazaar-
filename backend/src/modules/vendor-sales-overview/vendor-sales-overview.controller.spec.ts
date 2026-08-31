import { Test, TestingModule } from '@nestjs/testing';
import { VendorSalesOverviewController } from './vendor-sales-overview.controller';
import { VendorSalesOverviewService } from './vendor-sales-overview.service';

describe('VendorSalesOverviewController', () => {
  let controller: VendorSalesOverviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendorSalesOverviewController],
      providers: [{ provide: VendorSalesOverviewService, useValue: {} }],
    }).compile();

    controller = module.get<VendorSalesOverviewController>(
      VendorSalesOverviewController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
