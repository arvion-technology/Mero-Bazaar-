import { Controller, Post, Param, Patch, Delete, Get, Body, Query, UseGuards, Request } from '@nestjs/common';
import { SecondhandService } from './secondhand.service';
import { CreateSecondHandDto } from './dto/create_secondhand.dto';
import { QuerySecondHandDto } from './dto/query_secondhand.dto';
import { UpdateSecondHandDto } from './dto/update_secondhand.dto';
import { JwtAuthGuard } from '../auth/jwt_auth.guards';

@Controller('secondhand')
export class SecondhandController {
  constructor(private readonly service: SecondhandService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateSecondHandDto, @Request() req) {
    return this.service.create(dto, req.user.id);
  }

  @Get()
  findAll(@Query() query: QuerySecondHandDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSecondHandDto, @Request() req) {
    return this.service.update(id, dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.service.remove(id, req.user.id);
  }
}
