import { Test, TestingModule } from '@nestjs/testing';
import { SecondhandController } from './secondhand.controller';

describe('SecondhandController', () => {
  let controller: SecondhandController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecondhandController],
    }).compile();

    controller = module.get<SecondhandController>(SecondhandController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
