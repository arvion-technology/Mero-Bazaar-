<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { MedicalAppointmentsController } from './appointments.controller';
import { MedicalAppointmentsService } from './appointments.service';

describe('MedicalAppointmentsController', () => {
  let controller: MedicalAppointmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicalAppointmentsController],
      providers: [{ provide: MedicalAppointmentsService, useValue: {} }],
    }).compile();

    controller = module.get<MedicalAppointmentsController>(
      MedicalAppointmentsController,
    );
=======
import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsController } from './appointments.controller';

describe('AppointmentsController', () => {
  let controller: AppointmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
    }).compile();

    controller = module.get<AppointmentsController>(AppointmentsController);
>>>>>>> origin/aashika
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
