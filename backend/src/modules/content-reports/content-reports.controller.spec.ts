import { Test, TestingModule } from '@nestjs/testing';
import { ContentReportsController } from './content-reports.controller';

describe('ContentReportsController', () => {
  let controller: ContentReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentReportsController],
    }).compile();

    controller = module.get<ContentReportsController>(ContentReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
