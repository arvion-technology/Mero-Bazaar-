import { Test, TestingModule } from '@nestjs/testing';
import { RentalService } from './rental.service';
import { PrismaService } from 'src/database/prisma.service';

describe('RentalService', () => {
  let service: RentalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RentalService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<RentalService>(RentalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
