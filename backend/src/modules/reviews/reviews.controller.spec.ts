<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
=======
import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsController } from './reviews.controller';
>>>>>>> origin/aashika

describe('ReviewsController', () => {
  let controller: ReviewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewsController],
<<<<<<< HEAD
      providers: [{ provide: ReviewsService, useValue: {} }],
=======
>>>>>>> origin/aashika
    }).compile();

    controller = module.get<ReviewsController>(ReviewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
