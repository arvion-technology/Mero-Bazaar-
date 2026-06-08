import { Controller, Delete, Param, Patch, Get, Post, Body, UseGuards, Request} from '@nestjs/common';
import { HairBeautyAndWellnessService } from './beauty.service';
import { CreateHairBeautyAndWellnessDto } from './dto/create_beauty.dto';
import { UpdateHairBeautyAndWellnessDto } from './dto/update_beauty.dto';
import { JwtAuthGuard } from '../auth/jwt_auth.guards';

@Controller('beauty')
export class HairBeautyAndWellnessController {
  constructor(private readonly beautyService: HairBeautyAndWellnessService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateHairBeautyAndWellnessDto, @Request() req) {
    return this.beautyService.create(dto, req.user.id);
  }

  @Get()
  findAll() {
    return this.beautyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.beautyService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateHairBeautyAndWellnessDto, @Request() req) {
    return this.beautyService.update(id, dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.beautyService.remove(id, req.user.id);
  }
}
