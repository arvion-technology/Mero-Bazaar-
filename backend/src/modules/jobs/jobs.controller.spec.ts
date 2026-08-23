<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
=======
import { Test, TestingModule } from '@nestjs/testing';
import { JobsController } from './jobs.controller';
>>>>>>> origin/aashika

describe('JobsController', () => {
  let controller: JobsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobsController],
<<<<<<< HEAD
      providers: [{ provide: JobsService, useValue: {} }],
=======
>>>>>>> origin/aashika
    }).compile();

    controller = module.get<JobsController>(JobsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
