<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { BeautyAppointmentsController } from './appointments.controller';
import { BeautyAppointmentsService } from './appointments.service';

describe('BeautyAppointmentsController', () => {
  let controller: BeautyAppointmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BeautyAppointmentsController],
      providers: [{ provide: BeautyAppointmentsService, useValue: {} }],
    }).compile();

    controller = module.get<BeautyAppointmentsController>(
      BeautyAppointmentsController,
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
