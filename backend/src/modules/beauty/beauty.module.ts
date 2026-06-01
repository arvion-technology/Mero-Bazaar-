import { Module } from '@nestjs/common';
import { HairBeautyAndWellnessController } from './beauty.controller';
import { HairBeautyAndWellnessService } from './beauty.service';
import { PrismaService } from 'src/database/prisma.service';
import { BeautySlotsController } from './slots/slots.controller';
import { BeautyAppointmentsController } from './appointments/appointments.controller';
import { BeautyAppointmentsService } from './appointments/appointments.service';
import { BeautySlotsService } from './slots/slots.service';

@Module({
  controllers: [HairBeautyAndWellnessController, BeautySlotsController, BeautyAppointmentsController],
  providers: [HairBeautyAndWellnessService, PrismaService, BeautySlotsService, BeautyAppointmentsService],
})
export class BeautyModule {}
