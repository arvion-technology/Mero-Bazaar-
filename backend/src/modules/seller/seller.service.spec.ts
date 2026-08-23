import { Test, TestingModule } from '@nestjs/testing';
import { SellersService } from './seller.service';
import { PrismaService } from 'src/database/prisma.service';

describe('SellersService', () => {
  let service: SellersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SellersService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<SellersService>(SellersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
