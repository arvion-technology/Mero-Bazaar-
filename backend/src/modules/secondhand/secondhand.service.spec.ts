import { Test, TestingModule } from '@nestjs/testing';
import { SecondhandService } from './secondhand.service';

describe('SecondhandService', () => {
  let service: SecondhandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecondhandService],
    }).compile();

    service = module.get<SecondhandService>(SecondhandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
