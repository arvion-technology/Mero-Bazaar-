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
import { BeautySlotsService } from './slots.service';
import { CreateBeautySlotDto } from './dto/create_beauty_slot.dto';
import { UpdateBeautySlotDto } from './dto/update_beauty_slot.dto';
import { JwtAuthGuard } from '../../auth/jwt_auth.guards';

@Controller('beauty/slots')
export class BeautySlotsController {
  constructor(private readonly slotsService: BeautySlotsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateBeautySlotDto, @Request() req) {
    return this.slotsService.create(dto, req.user.id, req.user.role);
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

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
<<<<<<< HEAD
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBeautySlotDto,
    @Request() req,
  ) {
=======
  update(@Param('id') id: string, @Body() dto: UpdateBeautySlotDto, @Request() req) {
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
