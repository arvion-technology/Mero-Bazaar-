import { Controller, Delete, Param, Patch, Get, Body, Query, Post, UseGuards, Request } from '@nestjs/common';
import { CreateFoodsAndHomeDeliveryDto } from './dto/create_foods.dto';
import { QueryFoodsAndHomeDeliveryDto } from './dto/query_foods.dto';
import { UpdateFoodsAndHomeDeliveryDto } from './dto/update_foods.dto';
import { FoodsService } from './foods.service';
import { JwtAuthGuard } from '../auth/jwt_auth.guards';

@Controller('foods')
export class FoodsController {
  constructor(private readonly service: FoodsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateFoodsAndHomeDeliveryDto, @Request() req) {
    return this.service.create(dto, req.user.id);
  }

  @Get()
  findAll(@Query() query: QueryFoodsAndHomeDeliveryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFoodsAndHomeDeliveryDto, @Request() req) {
    return this.service.update(id, dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.service.remove(id, req.user.id);
  }
}
