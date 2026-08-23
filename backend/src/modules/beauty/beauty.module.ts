import { Module } from '@nestjs/common';
import { HairBeautyAndWellnessController } from './beauty.controller';
import { HairBeautyAndWellnessService } from './beauty.service';
import { PrismaService } from 'src/database/prisma.service';
import { BeautySlotsController } from './slots/slots.controller';
import { BeautyAppointmentsController } from './appointments/appointments.controller';
import { BeautyAppointmentsService } from './appointments/appointments.service';
import { BeautySlotsService } from './slots/slots.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [
    BeautySlotsController,
    BeautyAppointmentsController,
    HairBeautyAndWellnessController,
  ],
<<<<<<< HEAD
  providers: [
    HairBeautyAndWellnessService,
    PrismaService,
    BeautySlotsService,
    BeautyAppointmentsService,
  ],
=======
  providers: [HairBeautyAndWellnessService, PrismaService, BeautySlotsService, BeautyAppointmentsService],
>>>>>>> origin/aashika
})
export class BeautyModule {}
