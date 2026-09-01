import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt_auth.guards';
import { ContentReportsService } from './content-reports.service';
import { CreateReportDto } from './dto/create_report.dto';

@Controller('content-reports')
@UseGuards(JwtAuthGuard)
export class ContentReportsController {
  constructor(private readonly contentReportsService: ContentReportsService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateReportDto) {
    return this.contentReportsService.create(req.user.id, dto);
  }
}