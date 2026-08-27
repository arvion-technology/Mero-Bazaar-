import { Test, TestingModule } from '@nestjs/testing';
import { ListingsService } from './listings.service';
import { PrismaService } from 'src/database/prisma.service';

describe('ListingsService', () => {
  let service: ListingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListingsService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<ListingsService>(ListingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
