import { Controller, Delete, Post, Param, Patch, Query, Body, Get } from '@nestjs/common';
import { AgricultureService } from './agriculture.service';
import { CreateAgricultureDto } from './dto/create_agriculture.dto';
import { QueryAgricultureDto } from './dto/query_agriculture.dto';
import { UpdateAgricultureDto } from './dto/update_agriculture.dto';

@Controller('agriculture')
export class AgricultureController {
  constructor(private readonly service: AgricultureService) {}

  @Post()
  create(@Body() dto: CreateAgricultureDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryAgricultureDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAgricultureDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

