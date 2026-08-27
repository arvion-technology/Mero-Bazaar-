import { Test, TestingModule } from '@nestjs/testing';
import { MedicalAppointmentsController } from './appointments.controller';
import { MedicalAppointmentsService } from './appointments.service';

describe('MedicalAppointmentsController', () => {
  let controller: MedicalAppointmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicalAppointmentsController],
      providers: [{ provide: MedicalAppointmentsService, useValue: {} }],
    }).compile();

    controller = module.get<MedicalAppointmentsController>(
      MedicalAppointmentsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
