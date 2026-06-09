import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';

import { MedicalService } from './medical.service';
import { MedicalController } from './medical.controller';

import { VerificationService } from '../verification/verification.service';
import { VerificationController } from '../verification/verification.controller';
import { MedicalAppointmentsController } from './appointments/appointments.controller';
import { MedicalSlotsController } from './slots/slots.controller';
import { MedicalSlotsService } from './slots/slots.service';
import { MedicalAppointmentsService } from './appointments/appointments.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [
    MedicalController,
    VerificationController,
    MedicalAppointmentsController,
    MedicalSlotsController,
  ],
  providers: [
    MedicalService,
    VerificationService,
    MedicalSlotsService,
    MedicalAppointmentsService,
  ],
})
export class MedicalModule {}