import { Controller, Delete, Param, Patch, Get, Post, Body } from '@nestjs/common';
import { HairBeautyAndWellnessService } from './beauty.service';
import { CreateHairBeautyAndWellnessDto } from './dto/create_beauty.dto';
import { UpdateHairBeautyAndWellnessDto } from './dto/update_beauty.dto';

@Controller('beauty')
export class HairBeautyAndWellnessController {
  constructor(private readonly beautyService: HairBeautyAndWellnessService) {}

  @Post()
  create(@Body() dto: CreateHairBeautyAndWellnessDto) {
    return this.beautyService.create(dto);
  }

  @Get()
  findAll() {
    return this.beautyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.beautyService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateHairBeautyAndWellnessDto) {
    return this.beautyService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.beautyService.remove(id);
  }
}
