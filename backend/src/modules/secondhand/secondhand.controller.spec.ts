<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { SecondhandController } from './secondhand.controller';
import { SecondhandService } from './secondhand.service';
=======
import { Test, TestingModule } from '@nestjs/testing';
import { SecondhandController } from './secondhand.controller';
>>>>>>> origin/aashika

describe('SecondhandController', () => {
  let controller: SecondhandController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecondhandController],
<<<<<<< HEAD
      providers: [{ provide: SecondhandService, useValue: {} }],
=======
>>>>>>> origin/aashika
    }).compile();

    controller = module.get<SecondhandController>(SecondhandController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
