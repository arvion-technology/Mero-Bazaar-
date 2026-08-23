<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
=======
import { Test, TestingModule } from '@nestjs/testing';
import { LeadsController } from './leads.controller';
>>>>>>> origin/aashika

describe('LeadsController', () => {
  let controller: LeadsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeadsController],
<<<<<<< HEAD
      providers: [{ provide: LeadsService, useValue: {} }],
=======
>>>>>>> origin/aashika
    }).compile();

    controller = module.get<LeadsController>(LeadsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
