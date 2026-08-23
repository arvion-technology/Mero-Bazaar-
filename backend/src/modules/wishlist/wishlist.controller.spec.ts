<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
=======
import { Test, TestingModule } from '@nestjs/testing';
import { WishlistController } from './wishlist.controller';
>>>>>>> origin/aashika

describe('WishlistController', () => {
  let controller: WishlistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WishlistController],
<<<<<<< HEAD
      providers: [{ provide: WishlistService, useValue: {} }],
=======
>>>>>>> origin/aashika
    }).compile();

    controller = module.get<WishlistController>(WishlistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
