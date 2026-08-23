<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { ListingsController } from './listings.controller';
import { ListingsService } from './listings.service';
=======
import { Test, TestingModule } from '@nestjs/testing';
import { ListingsController } from './listings.controller';
>>>>>>> origin/aashika

describe('ListingsController', () => {
  let controller: ListingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListingsController],
<<<<<<< HEAD
      providers: [{ provide: ListingsService, useValue: {} }],
=======
>>>>>>> origin/aashika
    }).compile();

    controller = module.get<ListingsController>(ListingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
