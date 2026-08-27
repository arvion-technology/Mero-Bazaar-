import { Test, TestingModule } from '@nestjs/testing';
import { BeautyAppointmentsController } from './appointments.controller';
import { BeautyAppointmentsService } from './appointments.service';

describe('BeautyAppointmentsController', () => {
  let controller: BeautyAppointmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BeautyAppointmentsController],
      providers: [{ provide: BeautyAppointmentsService, useValue: {} }],
    }).compile();

    controller = module.get<BeautyAppointmentsController>(
      BeautyAppointmentsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
