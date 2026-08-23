<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { AgricultureController } from './agriculture.controller';
import { AgricultureService } from './agriculture.service';
=======
import { Test, TestingModule } from '@nestjs/testing';
import { AgricultureController } from './agriculture.controller';
>>>>>>> origin/aashika

describe('AgricultureController', () => {
  let controller: AgricultureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgricultureController],
<<<<<<< HEAD
      providers: [{ provide: AgricultureService, useValue: {} }],
=======
>>>>>>> origin/aashika
    }).compile();

    controller = module.get<AgricultureController>(AgricultureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
