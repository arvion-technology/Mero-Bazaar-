import { Body, Controller, Get, Param, Patch, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt_auth.guards';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ReportSource, ReportStatus, ReportTargetType, UserRole } from '@prisma/client';
import { AdminReportService } from './admin-report.service';

@Controller('admin/reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminReportController {
  constructor(private readonly adminReportService: AdminReportService) {}

  @Get()
  findAll(
    @Query('source') source?: ReportSource,
    @Query('targetType') targetType?: ReportTargetType,
    @Query('status') status?: ReportStatus,
  ) {
    return this.adminReportService.findAllForAdmin({ source, targetType, status });
  }

  @Patch(':id/status')
  setStatus(
    @Param('id') id: string,
    @Request() req,
    @Body('status') status: ReportStatus,
    @Body('resolutionNote') resolutionNote?: string,
  ) {
    return this.adminReportService.setStatus(id, status, req.user.id, resolutionNote);
  }
}