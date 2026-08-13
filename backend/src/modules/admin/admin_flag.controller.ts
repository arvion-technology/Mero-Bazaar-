import { Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt_auth.guards';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ReportStatus, ReportTargetType, UserRole } from '@prisma/client';
import { AdminReportService } from './admin-report.service';
import { AdminFlagService } from './admin_flag.service';
import { CreateReportDto } from './dto/create_report.dto';

@Controller('admin/flags')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminFlagController {
  constructor(
    private readonly adminFlagService: AdminFlagService,
    private readonly adminReportService: AdminReportService,
  ) {}

  @Get()
  findAll(
    @Query('targetType') targetType?: ReportTargetType,
    @Query('status') status?: ReportStatus,
  ) {
    return this.adminReportService.findAllForAdmin({
      source: 'ADMIN_FLAG',
      targetType,
      status,
    });
  }

  @Post()
  create(@Body() dto: CreateReportDto, @Request() req) {
    return this.adminFlagService.create(dto, req.user.id);
  }
}