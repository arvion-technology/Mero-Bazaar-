import { Controller, Post, Body, Delete, Param, Get, Patch } from '@nestjs/common';
import { CreateMedicalAppointmentDto } from './dto/create_medical_appointment.dto';
import { MedicalAppointmentsService } from './appointments.service';
import { UpdateMedicalAppointmentStatusDto } from './dto/update_beauty_appointment_status.dto';

@Controller('medical/appointments')
export class MedicalAppointmentsController {
  constructor(private readonly appointmentsService: MedicalAppointmentsService) {}

  @Post()
  create(@Body() dto: CreateMedicalAppointmentDto) {
    return this.appointmentsService.create(dto);
  }

  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  } 

  @Get('by-listing/:listingId')
  findByListing(@Param('listingId') listingId: string) {
    return this.appointmentsService.findByMedical(listingId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateMedicalAppointmentStatusDto,
  ) {
    return this.appointmentsService.updateStatus(id, dto.status);
  }

  @Delete(':id')
  cancel(@Param('id') id: string) {
    return this.appointmentsService.cancel(id);
  }
}

