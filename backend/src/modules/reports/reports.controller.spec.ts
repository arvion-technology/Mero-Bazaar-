<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
=======
import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
>>>>>>> origin/aashika

describe('ReportsController', () => {
  let controller: ReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
<<<<<<< HEAD
      providers: [{ provide: ReportsService, useValue: {} }],
=======
>>>>>>> origin/aashika
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
