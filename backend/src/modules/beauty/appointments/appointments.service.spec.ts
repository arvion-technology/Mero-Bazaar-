<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { BeautyAppointmentsService } from './appointments.service';
import { PrismaService } from 'src/database/prisma.service';

describe('BeautyAppointmentsService', () => {
  let service: BeautyAppointmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BeautyAppointmentsService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<BeautyAppointmentsService>(BeautyAppointmentsService);
=======
import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from './appointments.service';

describe('AppointmentsService', () => {
  let service: AppointmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppointmentsService],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
>>>>>>> origin/aashika
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
