import { Test, TestingModule } from '@nestjs/testing';
import { HairBeautyAndWellnessService } from './beauty.service';
import { PrismaService } from 'src/database/prisma.service';

describe('HairBeautyAndWellnessService', () => {
  let service: HairBeautyAndWellnessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HairBeautyAndWellnessService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<HairBeautyAndWellnessService>(
      HairBeautyAndWellnessService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
