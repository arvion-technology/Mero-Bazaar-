import { Test, TestingModule } from '@nestjs/testing';
import { BeautyService } from './beauty.service';

describe('BeautyService', () => {
  let service: BeautyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BeautyService],
    }).compile();

    service = module.get<BeautyService>(BeautyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
