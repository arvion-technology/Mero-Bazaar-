import { Controller, Post, Get, Body, Query, Param } from '@nestjs/common';
import { MedicalService } from './medical.service';
import { CreateMedicalDto } from './dto/create_medical.dto';
import { MedicalQueryDto } from './dto/medical_query.dto';
import { CreateAppointmentDto } from './appointments/dto/create_appointment.dto';
import { UpdateAppointmentStatusDto } from './appointments/dto/update_appointment_status.dto';

@Controller('medical')
export class MedicalController {
  constructor(
    private readonly medicalService: MedicalService,
  ) {}

  @Post()
  create(@Body() dto: CreateMedicalDto) {
    return this.medicalService.create(dto);
  }

  @Get()
  findAll(@Query() query: MedicalQueryDto) {
    return this.medicalService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicalService.findOne(id);
  }
}