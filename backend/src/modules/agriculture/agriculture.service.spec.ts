<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { AgricultureService } from './agriculture.service';
import { PrismaService } from 'src/database/prisma.service';
=======
import { Test, TestingModule } from '@nestjs/testing';
import { AgricultureService } from './agriculture.service';
>>>>>>> origin/aashika

describe('AgricultureService', () => {
  let service: AgricultureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
<<<<<<< HEAD
      providers: [AgricultureService, { provide: PrismaService, useValue: {} }],
=======
      providers: [AgricultureService],
>>>>>>> origin/aashika
    }).compile();

    service = module.get<AgricultureService>(AgricultureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
