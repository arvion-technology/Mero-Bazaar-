<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { RentalService } from './rental.service';
import { PrismaService } from 'src/database/prisma.service';
=======
import { Test, TestingModule } from '@nestjs/testing';
import { RentalService } from './rental.service';
>>>>>>> origin/aashika

describe('RentalService', () => {
  let service: RentalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
<<<<<<< HEAD
      providers: [RentalService, { provide: PrismaService, useValue: {} }],
=======
      providers: [RentalService],
>>>>>>> origin/aashika
    }).compile();

    service = module.get<RentalService>(RentalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
