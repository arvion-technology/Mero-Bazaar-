<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { ListingsService } from './listings.service';
import { PrismaService } from 'src/database/prisma.service';
=======
import { Test, TestingModule } from '@nestjs/testing';
import { ListingsService } from './listings.service';
>>>>>>> origin/aashika

describe('ListingsService', () => {
  let service: ListingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
<<<<<<< HEAD
      providers: [ListingsService, { provide: PrismaService, useValue: {} }],
=======
      providers: [ListingsService],
>>>>>>> origin/aashika
    }).compile();

    service = module.get<ListingsService>(ListingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
