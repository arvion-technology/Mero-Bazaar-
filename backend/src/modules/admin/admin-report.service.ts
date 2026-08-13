import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ReportSource, ReportTargetType, ReportStatus } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AdminReportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  findAllForAdmin(filters: {
    source?: ReportSource;
    targetType?: ReportTargetType;
    status?: ReportStatus;
  }) {
    return this.prisma.report.findMany({
      where: {
        ...(filters.source && { source: filters.source }),
        ...(filters.targetType && { targetType: filters.targetType }),
        ...(filters.status && { status: filters.status }),
      },
      select: {
        id: true,
        source: true,
        targetType: true,
        reason: true,
        description: true,
        status: true,
        reviewedBy: true,
        reviewedAt: true,
        resolutionNote: true,
        createdAt: true,
        listing: { select: { id: true, title: true } },
        targetUser: { select: { id: true, name: true, email: true } },
        review: {
          select: {
            id: true,
            comment: true,
            listing: { select: { title: true } },
          },
        },
        reporter: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async setStatus(id: string, status: ReportStatus, reviewerId: string, resolutionNote?: string) {
    const updated = await this.prisma.report.update({
      where: { id },
      data: {
        status,
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
        ...(resolutionNote && { resolutionNote }),
      },
    });

    if (status === 'ACTIONED') {
      await this.notificationsService.notifyAllAdmins({
        category: 'SYSTEM',
        type: 'REPORT_ACTIONED',
        title: 'Report actioned',
        description: `A ${updated.reason.replace(/_/g, ' ').toLowerCase()} report was actioned.`,
      });
    }

    return updated;
  }
}