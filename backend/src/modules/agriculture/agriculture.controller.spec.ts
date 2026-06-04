import { Test, TestingModule } from '@nestjs/testing';
import { AgricultureController } from './agriculture.controller';

describe('AgricultureController', () => {
  let controller: AgricultureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgricultureController],
    }).compile();

    controller = module.get<AgricultureController>(AgricultureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
