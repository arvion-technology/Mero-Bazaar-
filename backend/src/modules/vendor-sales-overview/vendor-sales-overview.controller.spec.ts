import { Test, TestingModule } from '@nestjs/testing';
import { VendorSalesOverviewController } from './vendor-sales-overview.controller';

describe('VendorSalesOverviewController', () => {
  let controller: VendorSalesOverviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendorSalesOverviewController],
    }).compile();

    controller = module.get<VendorSalesOverviewController>(VendorSalesOverviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
