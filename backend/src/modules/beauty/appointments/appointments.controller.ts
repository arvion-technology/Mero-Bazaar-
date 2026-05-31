import { Controller, Delete, Param, Get, Post, Body } from '@nestjs/common';
import { CreateBeautyAppointmentDto } from './dto/create_beauty_appointment.dto';
import { BeautyAppointmentsService } from './appointments.service';

@Controller('beauty/appointments')
export class BeautyAppointmentsController {
  constructor(
    private readonly appointmentsService: BeautyAppointmentsService,
  ) {}

  @Post()
  create(@Body() dto: CreateBeautyAppointmentDto) {
    return this.appointmentsService.create(dto);
  }

  @Get('beauty/:beautyId')
  findByBeauty(@Param('beautyId') beautyId: string) {
    return this.appointmentsService.findByBeauty(beautyId);
  }

  @Delete(':id')
  cancel(@Param('id') id: string) {
    return this.appointmentsService.cancel(id);
  }
}