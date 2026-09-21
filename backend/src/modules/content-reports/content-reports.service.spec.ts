import { Test, TestingModule } from '@nestjs/testing';
import { ContentReportsService } from './content-reports.service';
import { PrismaService } from 'src/database/prisma.service';

describe('ContentReportsService', () => {
  let service: ContentReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentReportsService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<ContentReportsService>(ContentReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
