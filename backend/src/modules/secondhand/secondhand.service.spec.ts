import { Test, TestingModule } from '@nestjs/testing';
import { SecondhandService } from './secondhand.service';
import { PrismaService } from 'src/database/prisma.service';

describe('SecondhandService', () => {
  let service: SecondhandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecondhandService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<SecondhandService>(SecondhandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
