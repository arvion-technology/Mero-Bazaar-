import { Test, TestingModule } from '@nestjs/testing';
import { SellersController } from './seller.controller';
import { SellersService } from './seller.service';

describe('SellersController', () => {
  let controller: SellersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SellersController],
      providers: [{ provide: SellersService, useValue: {} }],
    }).compile();

    controller = module.get<SellersController>(SellersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
