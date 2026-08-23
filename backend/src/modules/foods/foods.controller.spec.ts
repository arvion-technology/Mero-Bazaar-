<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { FoodsController } from './foods.controller';
import { FoodsService } from './foods.service';
=======
import { Test, TestingModule } from '@nestjs/testing';
import { FoodsController } from './foods.controller';
>>>>>>> origin/aashika

describe('FoodsController', () => {
  let controller: FoodsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoodsController],
<<<<<<< HEAD
      providers: [{ provide: FoodsService, useValue: {} }],
=======
>>>>>>> origin/aashika
    }).compile();

    controller = module.get<FoodsController>(FoodsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
