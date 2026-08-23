import { Test, TestingModule } from '@nestjs/testing';
import { AgricultureController } from './agriculture.controller';
import { AgricultureService } from './agriculture.service';

describe('AgricultureController', () => {
  let controller: AgricultureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgricultureController],
      providers: [{ provide: AgricultureService, useValue: {} }],
    }).compile();

    controller = module.get<AgricultureController>(AgricultureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
