<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { HairBeautyAndWellnessService } from './beauty.service';
import { PrismaService } from 'src/database/prisma.service';

describe('HairBeautyAndWellnessService', () => {
  let service: HairBeautyAndWellnessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HairBeautyAndWellnessService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<HairBeautyAndWellnessService>(
      HairBeautyAndWellnessService,
    );
=======
import { Test, TestingModule } from '@nestjs/testing';
import { BeautyService } from './beauty.service';

describe('BeautyService', () => {
  let service: BeautyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BeautyService],
    }).compile();

    service = module.get<BeautyService>(BeautyService);
>>>>>>> origin/aashika
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
