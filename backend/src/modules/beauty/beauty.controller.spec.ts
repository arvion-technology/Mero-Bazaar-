<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { HairBeautyAndWellnessController } from './beauty.controller';
import { HairBeautyAndWellnessService } from './beauty.service';

describe('HairBeautyAndWellnessController', () => {
  let controller: HairBeautyAndWellnessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HairBeautyAndWellnessController],
      providers: [{ provide: HairBeautyAndWellnessService, useValue: {} }],
    }).compile();

    controller = module.get<HairBeautyAndWellnessController>(
      HairBeautyAndWellnessController,
    );
=======
import { Test, TestingModule } from '@nestjs/testing';
import { BeautyController } from './beauty.controller';

describe('BeautyController', () => {
  let controller: BeautyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BeautyController],
    }).compile();

    controller = module.get<BeautyController>(BeautyController);
>>>>>>> origin/aashika
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
