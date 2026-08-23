<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { SellerPaymentsService } from './payments.service';
import { PrismaService } from 'src/database/prisma.service';

describe('SellerPaymentsService', () => {
  let service: SellerPaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SellerPaymentsService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<SellerPaymentsService>(SellerPaymentsService);
=======
import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './esewa.service';

describe('PaymentsService', () => {
  let service: PaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentsService],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
>>>>>>> origin/aashika
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
