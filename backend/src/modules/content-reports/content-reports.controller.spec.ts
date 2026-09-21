import { Test, TestingModule } from '@nestjs/testing';
import { ContentReportsController } from './content-reports.controller';
import { ContentReportsService } from './content-reports.service';
import { PrismaService } from 'src/database/prisma.service';

describe('ContentReportsController', () => {
  let controller: ContentReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentReportsController],
      providers: [ContentReportsService, { provide: PrismaService, useValue: {} }],
    }).compile();

    controller = module.get<ContentReportsController>(ContentReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
