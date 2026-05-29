import { Test, TestingModule } from '@nestjs/testing';
import { BeautyController } from './beauty.controller';

describe('BeautyController', () => {
  let controller: BeautyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BeautyController],
    }).compile();

    controller = module.get<BeautyController>(BeautyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
