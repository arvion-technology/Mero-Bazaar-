<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { MedicalService } from './medical.service';
import { PrismaService } from 'src/database/prisma.service';
=======
import { Test, TestingModule } from '@nestjs/testing';
import { MedicalService } from './medical.service';
>>>>>>> origin/aashika

describe('MedicalService', () => {
  let service: MedicalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
<<<<<<< HEAD
      providers: [MedicalService, { provide: PrismaService, useValue: {} }],
=======
      providers: [MedicalService],
>>>>>>> origin/aashika
    }).compile();

    service = module.get<MedicalService>(MedicalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
