import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ActivityType } from '@prisma/client';

const NOTIFIABLE_TYPES: ActivityType[] = [
  'PASSWORD_CHANGED',
  'TWO_FA_ENABLED',
  'TWO_FA_DISABLED',
  'PHONE_CHANGED',
];

@Injectable()
export class ActivityLogService {
  constructor(private prisma: PrismaService) {}

  log(
    userId: string,
    type: ActivityType,
    opts?: { ipAddress?: string; deviceLabel?: string; description?: string },
  ) {
    return this.prisma.activityLog.create({
      data: {
        userId,
        type,
        ipAddress: opts?.ipAddress,
        deviceLabel: opts?.deviceLabel,
        description: opts?.description,
      },
    });
  }

  list(userId: string, take = 50) {
    return this.prisma.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take,
    });
  }

  getUnreadSecurityNotifications(userId: string) {
    return this.prisma.activityLog.findMany({
      where: { userId, read: false, type: { in: NOTIFIABLE_TYPES } },
      orderBy: { createdAt: 'desc' },
    });
  }

  markAllRead(userId: string) {
    return this.prisma.activityLog.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }
}