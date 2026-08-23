<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { TradesService } from './trades.service';
import { PrismaService } from 'src/database/prisma.service';
=======
import { Test, TestingModule } from '@nestjs/testing';
import { TradesService } from './trades.service';
>>>>>>> origin/aashika

describe('TradesService', () => {
  let service: TradesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
<<<<<<< HEAD
      providers: [TradesService, { provide: PrismaService, useValue: {} }],
=======
      providers: [TradesService],
>>>>>>> origin/aashika
    }).compile();

    service = module.get<TradesService>(TradesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
