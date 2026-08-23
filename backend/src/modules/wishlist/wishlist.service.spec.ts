<<<<<<< HEAD
﻿import { Test, TestingModule } from '@nestjs/testing';
import { WishlistService } from './wishlist.service';
import { PrismaService } from 'src/database/prisma.service';
=======
import { Test, TestingModule } from '@nestjs/testing';
import { WishlistService } from './wishlist.service';
>>>>>>> origin/aashika

describe('WishlistService', () => {
  let service: WishlistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
<<<<<<< HEAD
      providers: [WishlistService, { provide: PrismaService, useValue: {} }],
=======
      providers: [WishlistService],
>>>>>>> origin/aashika
    }).compile();

    service = module.get<WishlistService>(WishlistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
