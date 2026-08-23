<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { VendorService } from './vendor.service';
import { PrismaService } from 'src/database/prisma.service';

describe('VendorService', () => {
  let service: VendorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VendorService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<VendorService>(VendorService);
=======
import { Test, TestingModule } from '@nestjs/testing';
import { VendorDashboardService } from './vendor.service';

describe('VendorDashboardService', () => {
  let service: VendorDashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VendorDashboardService],
    }).compile();

    service = module.get<VendorDashboardService>(VendorDashboardService);
>>>>>>> origin/aashika
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
