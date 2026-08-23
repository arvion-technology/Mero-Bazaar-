<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';

describe('VendorController', () => {
  let controller: VendorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendorController],
      providers: [{ provide: VendorService, useValue: {} }],
    }).compile();

    controller = module.get<VendorController>(VendorController);
=======
import { Test, TestingModule } from '@nestjs/testing';
import { VendorDashboardController } from './vendor.controller';

describe('VendorDashboardController', () => {
  let controller: VendorDashboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendorDashboardController],
    }).compile();

    controller = module.get<VendorDashboardController>(VendorDashboardController);
>>>>>>> origin/aashika
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
