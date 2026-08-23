<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { TradesController } from './trades.controller';
import { TradesService } from './trades.service';
=======
import { Test, TestingModule } from '@nestjs/testing';
import { TradesController } from './trades.controller';
>>>>>>> origin/aashika

describe('TradesController', () => {
  let controller: TradesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TradesController],
<<<<<<< HEAD
      providers: [{ provide: TradesService, useValue: {} }],
=======
>>>>>>> origin/aashika
    }).compile();

    controller = module.get<TradesController>(TradesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
