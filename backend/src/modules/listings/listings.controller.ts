import { Controller, Query, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create_listing.dto';
import { UpdateListingDto } from './dto/update_listing.dto';
import { SearchListingDto } from './dto/search_listing.dto';
import { JwtAuthGuard } from '../auth/jwt_auth.guards';
import { ListingCategory } from '@prisma/client';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateListingDto, @Request() req) {
    return this.listingsService.create(dto, req.user.id);
  }

  @Get()
  findAll(@Query() query: SearchListingDto) {
    return this.listingsService.search(query);
  } 
  
  @Get('related')
  getRelated(
  @Query('category') category: ListingCategory,
  @Query('exclude') exclude: string,
  @Query('limit') limit: number = 8,
  ) {
  return this.listingsService.getRelated(category, exclude, Number(limit));
 }

  @UseGuards(JwtAuthGuard)
  @Get('mine')
  findAllMine(@Request() req) {
    return this.listingsService.findAllMine(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('mine/stats')
  getMyStats(@Request() req) {
    return this.listingsService.getMyStats(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listingsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateListingDto, @Request() req) {
    return this.listingsService.update(id, dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.listingsService.remove(id, req.user.id);
  }
}
