import { Test, TestingModule } from '@nestjs/testing';
import { FeaturedService } from './featured.service';
import { PrismaService } from '../../database/prisma.service';

describe('FeaturedService', () => {
  let service: FeaturedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeaturedService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<FeaturedService>(FeaturedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
