import { Controller, Post, Body, Delete, Param, Get, Patch } from '@nestjs/common';
import { BeautyAppointmentsService } from './appointments.service';
import { CreateBeautyAppointmentDto } from './dto/create_beauty_appointment.dto';
import { UpdateBeautyAppointmentStatusDto } from './dto/update_beauty_appointment_status.dto';

@Controller('beauty/appointments')
export class BeautyAppointmentsController {
  constructor(private readonly appointmentsService: BeautyAppointmentsService) {}

  @Post()
  create(@Body() dto: CreateBeautyAppointmentDto) {
    return this.appointmentsService.create(dto);
  }

  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  } 

  @Get('by-listing/:listingId')
  findByListing(@Param('listingId') listingId: string) {
    return this.appointmentsService.findByBeauty(listingId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateBeautyAppointmentStatusDto,
  ) {
    return this.appointmentsService.updateStatus(id, dto.status);
  }

  @Delete(':id')
  cancel(@Param('id') id: string) {
    return this.appointmentsService.cancel(id);
  }
}