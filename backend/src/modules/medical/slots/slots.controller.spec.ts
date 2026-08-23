<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { MedicalSlotsController } from './slots.controller';
import { MedicalSlotsService } from './slots.service';

describe('MedicalSlotsController', () => {
  let controller: MedicalSlotsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicalSlotsController],
      providers: [{ provide: MedicalSlotsService, useValue: {} }],
    }).compile();

    controller = module.get<MedicalSlotsController>(MedicalSlotsController);
=======
import { Test, TestingModule } from '@nestjs/testing';
import { SlotsController } from './slots.controller';

describe('SlotsController', () => {
  let controller: SlotsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SlotsController],
    }).compile();

    controller = module.get<SlotsController>(SlotsController);
>>>>>>> origin/aashika
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
