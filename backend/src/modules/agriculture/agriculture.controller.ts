import { Controller, Delete, Post, Param, Patch, Query, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AgricultureService } from './agriculture.service';
import { CreateAgricultureDto } from './dto/create_agriculture.dto';
import { QueryAgricultureDto } from './dto/query_agriculture.dto';
import { UpdateAgricultureDto } from './dto/update_agriculture.dto';
import { JwtAuthGuard } from '../auth/jwt_auth.guards';

@Controller('agriculture')
export class AgricultureController {
  constructor(private readonly service: AgricultureService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateAgricultureDto, @Request() req) {
    return this.service.create(dto, req.user.id);
  }

  @Get()
  findAll(@Query() query: QueryAgricultureDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAgricultureDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}