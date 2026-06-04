import { Controller, Delete, Get, Param, Post, Body, Query, Patch } from '@nestjs/common';
import { RentalService } from './rental.service';
import { CreateRentalDto } from './dto/create_rental.dto';
import { QueryRentalDto } from './dto/query_rental.dto';
import { UpdateRentalDto } from './dto/update_rental.dto';

@Controller('rental')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Post()
  create(@Body() dto: CreateRentalDto) {
    return this.rentalService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryRentalDto) {
    return this.rentalService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rentalService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRentalDto) {
    return this.rentalService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rentalService.remove(id);
  }
}