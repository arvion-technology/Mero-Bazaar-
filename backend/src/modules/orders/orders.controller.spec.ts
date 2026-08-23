<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
=======
import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
>>>>>>> origin/aashika

describe('OrdersController', () => {
  let controller: OrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
<<<<<<< HEAD
      providers: [{ provide: OrdersService, useValue: {} }],
=======
>>>>>>> origin/aashika
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
