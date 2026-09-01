import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateReportDto } from './dto/create_report.dto';
import { ReportSource, ReportTargetType } from '@prisma/client';

@Injectable()
export class ContentReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(reporterId: string, dto: CreateReportDto) {
    const targetIdMap = {
      [ReportTargetType.LISTING]: dto.listingId,
      [ReportTargetType.USER]: dto.targetUserId,
      [ReportTargetType.REVIEW]: dto.reviewId,
    };
    const targetId = targetIdMap[dto.targetType];
    if (!targetId) {
      throw new BadRequestException(
        `Missing target id for targetType ${dto.targetType}`,
      );
    }

    return this.prisma.report.create({
      data: {
        source: ReportSource.USER_REPORT,
        targetType: dto.targetType,
        reason: dto.reason,
        description: dto.description,
        reporterId,
        listingId: dto.targetType === ReportTargetType.LISTING ? targetId : undefined,
        targetUserId: dto.targetType === ReportTargetType.USER ? targetId : undefined,
        reviewId: dto.targetType === ReportTargetType.REVIEW ? targetId : undefined,
      },
    });
  }
}