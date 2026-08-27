import { Test, TestingModule } from '@nestjs/testing';
import { FoodsService } from './foods.service';
import { PrismaService } from 'src/database/prisma.service';

describe('FoodsService', () => {
  let service: FoodsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FoodsService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<FoodsService>(FoodsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
