import { Test, TestingModule } from '@nestjs/testing';
import { MedicalService } from './medical.service';
import { PrismaService } from 'src/database/prisma.service';

describe('MedicalService', () => {
  let service: MedicalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicalService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<MedicalService>(MedicalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
