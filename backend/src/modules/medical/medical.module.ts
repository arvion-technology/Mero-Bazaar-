import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';

import { MedicalService } from './medical.service';
import { MedicalController } from './medical.controller';

import { AppointmentsService } from '../appointments/appointments.service';
import { AppointmentsController } from '../appointments/appointments.controller';

import { VerificationService } from '../verification/verification.service';
import { VerificationController } from '../verification/verification.controller';
import { MedicalAppointmentsController } from './appointments/appointments.controller';
import { MedicalSlotsController } from './slots/slots.controller';
import { MedicalSlotsService } from './slots/slots.service';
import { MedicalAppointmentsService } from './appointments/appointments.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    MedicalController,
    AppointmentsController,
    VerificationController,
    MedicalAppointmentsController,
    MedicalSlotsController,
  ],
  providers: [
    MedicalService,
    AppointmentsService,
    VerificationService,
    MedicalSlotsService,
    MedicalAppointmentsService,
  ],
})
export class MedicalModule {}