import { Test, TestingModule } from '@nestjs/testing';
import { SellerPaymentsService } from './payments.service';
import { PrismaService } from 'src/database/prisma.service';

describe('SellerPaymentsService', () => {
  let service: SellerPaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SellerPaymentsService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<SellerPaymentsService>(SellerPaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
