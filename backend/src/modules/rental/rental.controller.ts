import { Controller, Delete, Get, Param, Post, Body, Query, Patch, UseGuards, Request } from '@nestjs/common';
import { RentalService } from './rental.service';
import { CreateRentalDto } from './dto/create_rental.dto';
import { QueryRentalDto } from './dto/query_rental.dto';
import { UpdateRentalDto } from './dto/update_rental.dto';
import { JwtAuthGuard } from '../auth/jwt_auth.guards';

@Controller('rental')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateRentalDto, @Request() req) {
    return this.rentalService.create(dto, req.user.id);
  }

  @Get()
  findAll(@Query() query: QueryRentalDto) {
    return this.rentalService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rentalService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRentalDto, @Request() req) {
    return this.rentalService.update(id, dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.rentalService.remove(id, req.user.id);
  }
}