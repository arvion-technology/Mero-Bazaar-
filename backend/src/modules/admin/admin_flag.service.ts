import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateReportDto } from './dto/create_report.dto';

@Injectable()
export class AdminFlagService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateReportDto, adminId: string) {
    const targetIdMap = {
      LISTING: dto.listingId,
      USER: dto.targetUserId,
      REVIEW: dto.reviewId,
    } as const;

    const targetId = targetIdMap[dto.targetType];
    if (!targetId) {
      throw new BadRequestException(
        `targetType "${dto.targetType}" requires a matching id field`,
      );
    }

    return this.prisma.report.create({
      data: {
        source: 'ADMIN_FLAG',
        targetType: dto.targetType,
        reason: dto.reason,
        description: dto.description,
        reporterId: adminId,
        ...(dto.targetType === 'LISTING' && { listingId: dto.listingId }),
        ...(dto.targetType === 'USER' && { targetUserId: dto.targetUserId }),
        ...(dto.targetType === 'REVIEW' && { reviewId: dto.reviewId }),
      },
      select: { id: true, status: true, createdAt: true },
    });
  }
}