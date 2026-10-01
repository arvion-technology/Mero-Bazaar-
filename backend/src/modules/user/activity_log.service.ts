import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ActivityType } from '@prisma/client';
import { NotificationsGateway } from '../notifications/notifications.gateway'; // adjust path

const NOTIFIABLE_TYPES: ActivityType[] = [
  'PASSWORD_CHANGED',
  'TWO_FA_ENABLED',
  'TWO_FA_DISABLED',
  'PHONE_CHANGED',
];

@Injectable()
export class ActivityLogService {
  constructor(
    private prisma: PrismaService,
    private gateway: NotificationsGateway,
  ) {}

  async log(
    userId: string,
    type: ActivityType,
    opts?: { ipAddress?: string; deviceLabel?: string; description?: string },
  ) {
    const row = await this.prisma.activityLog.create({
      data: {
        userId,
        type,
        ipAddress: opts?.ipAddress,
        deviceLabel: opts?.deviceLabel,
        description: opts?.description,
      },
    });

    if (NOTIFIABLE_TYPES.includes(type)) {
      this.gateway.emitToUser(userId, 'security-event', row);
    }

    return row;
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