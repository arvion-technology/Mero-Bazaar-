import { Test, TestingModule } from '@nestjs/testing';
import { BeautyAppointmentsService } from './appointments.service';
import { PrismaService } from 'src/database/prisma.service';

describe('BeautyAppointmentsService', () => {
  let service: BeautyAppointmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BeautyAppointmentsService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<BeautyAppointmentsService>(BeautyAppointmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
