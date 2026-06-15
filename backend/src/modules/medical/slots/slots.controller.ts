import { Controller, Post, Body, Delete, Param, Get, Patch } from '@nestjs/common';
import { CreateMedicalSlotDto } from './dto/create_medical_slots.dto';
import { UpdateMedicalSlotDto } from './dto/update_medical_slots.dto';
import { MedicalSlotsService } from './slots.service';

@Controller('medical/slots')
export class MedicalSlotsController {
  constructor(private readonly slotsService: MedicalSlotsService) {}

  @Post()
  create(@Body() dto: CreateMedicalSlotDto) {
    return this.slotsService.create(dto);
  }

  @Get()
  findAll() {
    return this.slotsService.findAll();
  }

  @Get('listing-id/:listingId')
  findByListing(@Param('listingId') listingId: string) {
    return this.slotsService.findByListing(listingId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.slotsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMedicalSlotDto) {
    return this.slotsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.slotsService.remove(id);
  }
}

