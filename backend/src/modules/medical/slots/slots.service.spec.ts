import { Test, TestingModule } from '@nestjs/testing';
import { MedicalSlotsService } from './slots.service';
import { PrismaService } from 'src/database/prisma.service';

describe('MedicalSlotsService', () => {
  let service: MedicalSlotsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicalSlotsService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<MedicalSlotsService>(MedicalSlotsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
