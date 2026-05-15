import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';

import { MedicalService } from './medical.service';
import { MedicalController } from './medical.controller';

import { AppointmentsService } from './appointments/appointments.service';
import { AppointmentsController } from './appointments/appointments.controller';

import { VerificationService } from './verification/verification.service';
import { VerificationController } from './verification/verification.controller';

@Module({
  imports: [PrismaModule],
  controllers: [
    MedicalController,
    AppointmentsController,
    VerificationController,
  ],
  providers: [
    MedicalService,
    AppointmentsService,
    VerificationService,
  ],
})
export class MedicalModule {}