import { Controller, Post, Get, Body, Query, Param, UsePipes, ValidationPipe, ParseUUIDPipe } from '@nestjs/common';
import { MedicalService } from './medical.service';
import { CreateMedicalDto } from './dto/create_medical.dto';
import { MedicalQueryDto } from './dto/medical_query.dto';

@Controller('medical')
export class MedicalController {
  constructor(private readonly medicalService: MedicalService) {}

  @Post()
  create(@Body() dto: CreateMedicalDto) {
    return this.medicalService.create(dto);
  }

  @Get()
  findAll(@Query() query: MedicalQueryDto) {
    return this.medicalService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.medicalService.findOne(id);
  }
}