import { Test, TestingModule } from '@nestjs/testing';
import { VendorDashboardService } from './vendor.service';

describe('VendorDashboardService', () => {
  let service: VendorDashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VendorDashboardService],
    }).compile();

    service = module.get<VendorDashboardService>(VendorDashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
