import { Test, TestingModule } from '@nestjs/testing';
import { MedicalController } from './medical.controller';
import { MedicalService } from './medical.service';

describe('MedicalController', () => {
  let controller: MedicalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicalController],
      providers: [{ provide: MedicalService, useValue: {} }],
    }).compile();

    controller = module.get<MedicalController>(MedicalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
