import { Module } from '@nestjs/common';
import { MedicalService } from './medical.service';
import { MedicalController } from './medical.controller';
import { PrismaModule } from 'src/database/prisma.module';

import { AppointmentsController } from './appointments/appointments.controller';
import { AppointmentsService } from './appointments/appointments.service';

import { VerificationController } from './verification/verification.controller';
import { VerificationService } from './verification/verification.service';

@Module({
  imports: [PrismaModule],
  controllers: [MedicalController, AppointmentsController, VerificationController],
  providers: [MedicalService, AppointmentsService, VerificationService],
  exports: [PrismaModule],
})
export class MedicalModule {}
