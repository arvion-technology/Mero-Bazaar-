import { Test, TestingModule } from '@nestjs/testing';
import { MedicalService } from './medical.service';

describe('MedicalService', () => {
  let service: MedicalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicalService],
    }).compile();

    service = module.get<MedicalService>(MedicalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
