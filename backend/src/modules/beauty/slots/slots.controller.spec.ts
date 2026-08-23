import { Test, TestingModule } from '@nestjs/testing';
import { BeautySlotsController } from './slots.controller';
import { BeautySlotsService } from './slots.service';

describe('BeautySlotsController', () => {
  let controller: BeautySlotsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BeautySlotsController],
      providers: [{ provide: BeautySlotsService, useValue: {} }],
    }).compile();

    controller = module.get<BeautySlotsController>(BeautySlotsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
