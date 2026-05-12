import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create_listing.dto';
import { UpdateListingDto } from './dto/update_listing.dto';
import { Delete } from '@nestjs/common';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post()
  create(@Body() dto: CreateListingDto) {
    return this.listingsService.create(dto);
  }

  @Get()
  findAll() {
    return this.listingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string){
    return this.listingsService.findOne(id);
  }


  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateListingDto,
  ){
    return this. listingsService.update(id,dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listingsService.remove(id);
  }
}
