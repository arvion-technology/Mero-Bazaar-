import { Controller, Post, Body, Delete, Param, Get, Patch, UseGuards, Request } from '@nestjs/common';
import { BeautyAppointmentsService } from './appointments.service';
import { CreateBeautyAppointmentDto } from './dto/create_beauty_appointment.dto';
import { UpdateBeautyAppointmentStatusDto } from './dto/update_beauty_appointment_status.dto';
import { JwtAuthGuard } from '../../auth/jwt_auth.guards';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Controller('beauty/appointments')
export class BeautyAppointmentsController {
  constructor(private readonly appointmentsService: BeautyAppointmentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateBeautyAppointmentDto, @Request() req) {
    return this.appointmentsService.create(dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('mine')
  findMine(@Request() req) {
    return this.appointmentsService.findMine(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-listing/:listingId')
  findByListing(@Param('listingId') listingId: string, @Request() req) {
    return this.appointmentsService.findByBeauty(listingId, req.user.id, req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.appointmentsService.findOne(id, req.user.id, req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateBeautyAppointmentStatusDto,
    @Request() req,
  ) {
    return this.appointmentsService.updateStatus(id, dto.status, req.user.id, req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  cancel(@Param('id') id: string, @Request() req) {
    return this.appointmentsService.cancel(id, req.user.id, req.user.role);
  }
}