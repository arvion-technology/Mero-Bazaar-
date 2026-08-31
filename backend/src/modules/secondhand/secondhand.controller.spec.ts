import { Test, TestingModule } from '@nestjs/testing';
import { SecondhandController } from './secondhand.controller';
import { SecondhandService } from './secondhand.service';

describe('SecondhandController', () => {
  let controller: SecondhandController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecondhandController],
      providers: [{ provide: SecondhandService, useValue: {} }],
    }).compile();

    controller = module.get<SecondhandController>(SecondhandController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
