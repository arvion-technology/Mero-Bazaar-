import { Controller, Post, Get, Body, Query, Param, ParseUUIDPipe, UseGuards , Request, Delete, Patch} from '@nestjs/common';
import { MedicalService } from './medical.service';
import { CreateMedicalDto } from './dto/create_medical.dto';
import { MedicalQueryDto } from './dto/medical_query.dto';
import { JwtAuthGuard } from '../auth/jwt_auth.guards';

@Controller('medical')
export class MedicalController {
  constructor(private readonly medicalService: MedicalService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateMedicalDto, @Request() req) {
    return this.medicalService.create(dto, req.user.id);
  }

  @Get()
  findAll(@Query() query: MedicalQueryDto) {
    return this.medicalService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicalService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: CreateMedicalDto, @Request() req ) {
    return this.medicalService.update(id, dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.medicalService.remove(id, req.user.id);
  }
}
