import { Controller, Get, Post, Body, Param, Patch, Query, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create_lead.dto';
import { LeadStatus, ListingCategory } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt_auth.guards';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateLeadDto, @Req() req: Request) {
    const userId = (req.user as { id: string }).id;
    return this.leadsService.create(dto, userId);
  }

  @Get()
  findAll(
    @Query('category') category?: ListingCategory,
    @Query('status') status?: LeadStatus,
  ) {
    return this.leadsService.findAll({ category, status });
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: LeadStatus) {
    return this.leadsService.updateStatus(id, status);
  }
}