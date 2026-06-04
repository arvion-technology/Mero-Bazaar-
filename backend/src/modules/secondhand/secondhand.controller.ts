import { Controller, Post, Param, Patch, Delete, Get, Body, Query } from '@nestjs/common';
import { SecondhandService } from './secondhand.service';
import { CreateSecondHandDto } from './dto/create_secondhand.dto';
import { QuerySecondHandDto } from './dto/query_secondhand.dto';
import { UpdateSecondHandDto } from './dto/update_secondhand.dto';

@Controller('secondhand')
export class SecondhandController {
  constructor(private readonly service: SecondhandService) {}

  @Post()
  create(@Body() dto: CreateSecondHandDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: QuerySecondHandDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSecondHandDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
