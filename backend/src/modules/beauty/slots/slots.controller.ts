import { Controller, Post, Body, Delete, Param, Get, Patch } from '@nestjs/common';
import { BeautySlotsService } from './slots.service';
import { CreateBeautySlotDto } from './dto/create_beauty_slot.dto';
import { UpdateBeautySlotDto } from './dto/update_beauty_slot.dto';

@Controller('beauty/slots')
export class BeautySlotsController {
  constructor(private readonly slotsService: BeautySlotsService) {}

  @Post()
  create(@Body() createBeautySlotDto: CreateBeautySlotDto) {
    return this.slotsService.create(createBeautySlotDto);
  }

  @Get()
  findAll() {
    console.log('🔥 FINDALL HIT');
    return { ok: true };
  }

  @Get(':beautyId')
  findByBeauty(@Param('beautyId') beautyId: string) {
    return this.slotsService.findByBeauty(beautyId);
  }

  @Get('single/:id')
  findOne(@Param('id') id: string) {
    return this.slotsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBeautySlotDto: UpdateBeautySlotDto,
  ) {
    return this.slotsService.update(id, updateBeautySlotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.slotsService.remove(id);
  }
  @Get('debug')
  debug() {
    return this.slotsService.debugBeauty();
  }
}