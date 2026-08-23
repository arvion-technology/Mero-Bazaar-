import { Test, TestingModule } from '@nestjs/testing';
import { MedicalAppointmentsService } from './appointments.service';
import { PrismaService } from 'src/database/prisma.service';

describe('MedicalAppointmentsService', () => {
  let service: MedicalAppointmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicalAppointmentsService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<MedicalAppointmentsService>(
      MedicalAppointmentsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
