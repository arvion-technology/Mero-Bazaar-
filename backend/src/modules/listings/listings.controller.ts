import {
  Controller,
  Query,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
 } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create_listing.dto';
import { UpdateListingDto } from './dto/update_listing.dto';
import { SearchListingDto } from './dto/search_listing.dto';


@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post()
  create(@Body() dto: CreateListingDto) {
    return this.listingsService.create(dto);
  }

  @Get()
  findAll(@Query() query: SearchListingDto) {
    return this.listingsService.search(query);
  } 

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listingsService.findOne(id);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateListingDto) {
    return this.listingsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listingsService.remove(id);
  }
}
