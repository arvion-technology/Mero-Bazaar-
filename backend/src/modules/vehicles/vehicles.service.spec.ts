<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesService } from './vehicles.service';
import { PrismaService } from 'src/database/prisma.service';
=======
import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesService } from './vehicles.service';
>>>>>>> origin/aashika

describe('VehiclesService', () => {
  let service: VehiclesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
<<<<<<< HEAD
      providers: [VehiclesService, { provide: PrismaService, useValue: {} }],
=======
      providers: [VehiclesService],
>>>>>>> origin/aashika
    }).compile();

    service = module.get<VehiclesService>(VehiclesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
