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
import { CreateMedicalSlotDto } from './dto/create_medical_slots.dto';
import { UpdateMedicalSlotDto } from './dto/update_medical_slots.dto';
import { MedicalSlotsService } from './slots.service';
import { DoctorOnly } from '../../auth/roles_access.decorator';

@Controller('medical/slots')
export class MedicalSlotsController {
  constructor(private readonly slotsService: MedicalSlotsService) {}

  @DoctorOnly()
  @Post()
  create(@Body() dto: CreateMedicalSlotDto, @Request() req) {
    return this.slotsService.create(dto, req.user.id, req.user.role);
  }
  b;
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

  @DoctorOnly()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMedicalSlotDto,
    @Request() req,
  ) {
    return this.slotsService.update(id, dto, req.user.id, req.user.role);
  }

  @DoctorOnly()
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.slotsService.remove(id, req.user.id, req.user.role);
  }
}
