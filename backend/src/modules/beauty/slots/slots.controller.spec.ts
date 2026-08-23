<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { BeautySlotsController } from './slots.controller';
import { BeautySlotsService } from './slots.service';

describe('BeautySlotsController', () => {
  let controller: BeautySlotsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BeautySlotsController],
      providers: [{ provide: BeautySlotsService, useValue: {} }],
    }).compile();

    controller = module.get<BeautySlotsController>(BeautySlotsController);
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
