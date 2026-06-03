import { Controller, Post, Body, Delete, Param, Get, Patch } from '@nestjs/common';
import { BeautySlotsService } from './slots.service';
import { CreateBeautySlotDto } from './dto/create_beauty_slot.dto';
import { UpdateBeautySlotDto } from './dto/update_beauty_slot.dto';

@Controller('beauty/slots')
export class BeautySlotsController {
  constructor(private readonly slotsService: BeautySlotsService) {}

  @Post()
  create(@Body() dto: CreateBeautySlotDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateBeautySlotDto) {
    return this.slotsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.slotsService.remove(id);
  }
}