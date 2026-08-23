<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { SecondhandService } from './secondhand.service';
import { PrismaService } from 'src/database/prisma.service';
=======
import { Test, TestingModule } from '@nestjs/testing';
import { SecondhandService } from './secondhand.service';
>>>>>>> origin/aashika

describe('SecondhandService', () => {
  let service: SecondhandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
<<<<<<< HEAD
      providers: [SecondhandService, { provide: PrismaService, useValue: {} }],
=======
      providers: [SecondhandService],
>>>>>>> origin/aashika
    }).compile();

    service = module.get<SecondhandService>(SecondhandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
