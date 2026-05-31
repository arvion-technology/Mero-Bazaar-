import { Module } from '@nestjs/common';
import { BeautyController } from './beauty.controller';
import { BeautyService } from './beauty.service';
import { PrismaService } from 'src/database/prisma.service';
import { BeautySlotsController } from './slots/slots.controller';
import { BeautyAppointmentsController } from './appointments/appointments.controller';
import { BeautyAppointmentsService } from './appointments/appointments.service';
import { BeautySlotsService } from './slots/slots.service';

@Module({
  controllers: [BeautyController, BeautySlotsController, BeautyAppointmentsController],
  providers: [BeautyService, PrismaService, BeautySlotsService, BeautyAppointmentsService],
})
export class BeautyModule {}
