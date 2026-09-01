import { Test, TestingModule } from '@nestjs/testing';
import { ContentReportsService } from './content-reports.service';

describe('ContentReportsService', () => {
  let service: ContentReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentReportsService],
    }).compile();

    service = module.get<ContentReportsService>(ContentReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
