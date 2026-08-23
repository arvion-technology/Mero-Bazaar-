<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { VendorSalesOverviewService } from './vendor-sales-overview.service';
import { PrismaService } from 'src/database/prisma.service';
=======
import { Test, TestingModule } from '@nestjs/testing';
import { VendorSalesOverviewService } from './vendor-sales-overview.service';
>>>>>>> origin/aashika

describe('VendorSalesOverviewService', () => {
  let service: VendorSalesOverviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
<<<<<<< HEAD
      providers: [
        VendorSalesOverviewService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<VendorSalesOverviewService>(
      VendorSalesOverviewService,
    );
=======
      providers: [VendorSalesOverviewService],
    }).compile();

    service = module.get<VendorSalesOverviewService>(VendorSalesOverviewService);
>>>>>>> origin/aashika
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
