import { Body, Controller, Get, Post } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create_lead.dto';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  create(@Body() dto: CreateLeadDto) {
    return this.leadsService.create(dto);
  }

  @Get()
  findAll() {
    return this.leadsService.findAll();
  }
}
