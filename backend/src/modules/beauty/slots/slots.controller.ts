import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  Get,
  Patch,
  Request,
} from '@nestjs/common';
import { BeautySlotsService } from './slots.service';
import { CreateBeautySlotDto } from './dto/create_beauty_slot.dto';
import { UpdateBeautySlotDto } from './dto/update_beauty_slot.dto';
import { SellerOnly } from '../../auth/roles_access.decorator';

@Controller('beauty/slots')
export class BeautySlotsController {
  constructor(private readonly slotsService: BeautySlotsService) {}

  @SellerOnly()
  @Post()
  create(@Body() dto: CreateBeautySlotDto, @Request() req) {
    return this.slotsService.create(dto, req.user.id, req.user.role);
  }

  @Get()
  findAll() {
    return this.slotsService.findAll();
  }

  @Get('listing-id/:listingId')
  findByListing(@Param('listingId') listingId: string) {
    return this.slotsService.findByListing(listingId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.slotsService.findOne(id);
  }

  @SellerOnly()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBeautySlotDto,
    @Request() req,
  ) {
    return this.slotsService.update(id, dto, req.user.id, req.user.role);
  }

  @SellerOnly()
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.slotsService.remove(id, req.user.id, req.user.role);
  }
}
