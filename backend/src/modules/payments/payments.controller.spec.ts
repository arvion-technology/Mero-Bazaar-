import { Test, TestingModule } from '@nestjs/testing';
import { SellerPaymentsController } from './payments.controller';
import { SellerPaymentsService } from './payments.service';

describe('SellerPaymentsController', () => {
  let controller: SellerPaymentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SellerPaymentsController],
      providers: [{ provide: SellerPaymentsService, useValue: {} }],
    }).compile();

    controller = module.get<SellerPaymentsController>(SellerPaymentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
