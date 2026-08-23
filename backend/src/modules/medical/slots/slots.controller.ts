<<<<<<< HEAD
import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  Get,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
=======
import { Controller, Post, Body, Delete, Param, Get, Patch, UseGuards, Request } from '@nestjs/common';
>>>>>>> origin/aashika
import { CreateMedicalSlotDto } from './dto/create_medical_slots.dto';
import { UpdateMedicalSlotDto } from './dto/update_medical_slots.dto';
import { MedicalSlotsService } from './slots.service';
import { JwtAuthGuard } from '../../auth/jwt_auth.guards';

@Controller('medical/slots')
export class MedicalSlotsController {
  constructor(private readonly slotsService: MedicalSlotsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateMedicalSlotDto, @Request() req) {
    return this.slotsService.create(dto, req.user.id, req.user.role);
  }
<<<<<<< HEAD
  b;
=======
b
>>>>>>> origin/aashika
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

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
<<<<<<< HEAD
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMedicalSlotDto,
    @Request() req,
  ) {
=======
  update(@Param('id') id: string, @Body() dto: UpdateMedicalSlotDto, @Request() req) {
>>>>>>> origin/aashika
    return this.slotsService.update(id, dto, req.user.id, req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.slotsService.remove(id, req.user.id, req.user.role);
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/aashika
