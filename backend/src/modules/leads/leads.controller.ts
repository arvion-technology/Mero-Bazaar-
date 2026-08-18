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
  @UseGuards(JwtAuthGuard) 
  findAll(@Query('category') category?: ListingCategory, @Query('status') status?: LeadStatus) {
    return this.leadsService.findAll({ category, status });
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: LeadStatus,
    @Req() req: Request,
  ) {
    const sellerId = (req.user as { id: string }).id;
    return this.leadsService.updateStatus(id, status, sellerId);
  }

  @Get('mine/unread-count')
  @UseGuards(JwtAuthGuard)
  countUnread(@Req() req: Request) {
    const sellerId = (req.user as { id: string }).id;
    return this.leadsService.countUnreadForSeller(sellerId);
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  findMine(@Req() req: Request, @Query('status') status?: LeadStatus) {
    const sellerId = (req.user as { id: string }).id;
    return this.leadsService.findForSeller(sellerId, { status });
  }

  @Get('mine/sent')
  @UseGuards(JwtAuthGuard)
  findSent(@Req() req: Request) {
    const userId = (req.user as { id: string }).id;
    return this.leadsService.findSentByUser(userId);
  }
}