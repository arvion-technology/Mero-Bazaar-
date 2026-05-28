import { Controller, Delete, Param, Patch, Get, Body, Query, Post } from '@nestjs/common';
import { CreateFoodsAndHomeDeliveryDto } from './dto/create_foods.dto';
import { QueryFoodsAndHomeDeliveryDto } from './dto/query_foods.dto';
import { UpdateFoodsAndHomeDeliveryDto } from './dto/update_foods.dto';
import { FoodsService } from './foods.service';

@Controller('foods')
export class FoodsController {
  constructor(private readonly service: FoodsService) {}

  @Post()
  create(@Body() dto: CreateFoodsAndHomeDeliveryDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryFoodsAndHomeDeliveryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFoodsAndHomeDeliveryDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
