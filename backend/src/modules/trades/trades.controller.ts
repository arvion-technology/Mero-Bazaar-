import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  ParseFloatPipe,
  Patch,
} from '@nestjs/common';

import { TradesService } from './trades.service';
import { CreateTradesDto } from './dto/create_trades.dto';
import { QueryTradesDto } from './dto/query_trades.dto';
import { CreateLeadDto } from './dto/lead.dto';
import { UpdateTradesDto } from './dto/update_trades.dto';

@Controller('trades')
export class TradesController {
  constructor(private readonly tradesService: TradesService) {}

  @Post()
  create(@Body() dto: CreateTradesDto) {
    return this.tradesService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryTradesDto) {
    return this.tradesService.findAll(query);
  }

  @Get('emergency')
  emergency(@Query('city') city?: string) {
    return this.tradesService.emergency(city);
  }

  @Get('nearby')
  nearby(
    @Query('latitude', ParseFloatPipe) latitude: number,
    @Query('longitude', ParseFloatPipe) longitude: number,
    @Query('km', ParseFloatPipe) km: number,
  ) {
    return this.tradesService.nearby(latitude, longitude, km);
  }

  @Post(':id/lead')
  createLead(@Param('id') id: string, @Body() dto: CreateLeadDto) {
    return this.tradesService.createLead(id, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tradesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTradesDto) {
    return this.tradesService.update(id, dto);
  }
}