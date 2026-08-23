<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { MedicalController } from './medical.controller';
import { MedicalService } from './medical.service';
=======
import { Test, TestingModule } from '@nestjs/testing';
import { MedicalController } from './medical.controller';
>>>>>>> origin/aashika

describe('MedicalController', () => {
  let controller: MedicalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicalController],
<<<<<<< HEAD
      providers: [{ provide: MedicalService, useValue: {} }],
=======
>>>>>>> origin/aashika
    }).compile();

    controller = module.get<MedicalController>(MedicalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
