<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
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
=======
import { Test, TestingModule } from '@nestjs/testing';
import { SellerController } from './seller.controller';

describe('SellerController', () => {
  let controller: SellerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SellerController],
    }).compile();

    controller = module.get<SellerController>(SellerController);
>>>>>>> origin/aashika
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
