<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
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
=======
import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './esewa.controller';

describe('PaymentsController', () => {
  let controller: PaymentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
>>>>>>> origin/aashika
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
