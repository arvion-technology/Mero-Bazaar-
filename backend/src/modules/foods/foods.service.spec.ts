<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { FoodsService } from './foods.service';
import { PrismaService } from 'src/database/prisma.service';
=======
import { Test, TestingModule } from '@nestjs/testing';
import { FoodsService } from './foods.service';
>>>>>>> origin/aashika

describe('FoodsService', () => {
  let service: FoodsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
<<<<<<< HEAD
      providers: [FoodsService, { provide: PrismaService, useValue: {} }],
=======
      providers: [FoodsService],
>>>>>>> origin/aashika
    }).compile();

    service = module.get<FoodsService>(FoodsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
