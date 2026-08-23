<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { SellersService } from './seller.service';
import { PrismaService } from 'src/database/prisma.service';

describe('SellersService', () => {
  let service: SellersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SellersService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<SellersService>(SellersService);
=======
import { Test, TestingModule } from '@nestjs/testing';
import { SellerService } from './seller.service';

describe('SellerService', () => {
  let service: SellerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SellerService],
    }).compile();

    service = module.get<SellerService>(SellerService);
>>>>>>> origin/aashika
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
