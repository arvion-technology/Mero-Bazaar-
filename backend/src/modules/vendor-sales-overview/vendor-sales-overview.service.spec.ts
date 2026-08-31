import { Test, TestingModule } from '@nestjs/testing';
import { VendorSalesOverviewService } from './vendor-sales-overview.service';
import { PrismaService } from 'src/database/prisma.service';

describe('VendorSalesOverviewService', () => {
  let service: VendorSalesOverviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendorSalesOverviewService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<VendorSalesOverviewService>(
      VendorSalesOverviewService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
