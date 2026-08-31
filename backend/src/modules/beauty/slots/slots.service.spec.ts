import { Test, TestingModule } from '@nestjs/testing';
import { BeautySlotsService } from './slots.service';
import { PrismaService } from 'src/database/prisma.service';

describe('BeautySlotsService', () => {
  let service: BeautySlotsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BeautySlotsService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<BeautySlotsService>(BeautySlotsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
