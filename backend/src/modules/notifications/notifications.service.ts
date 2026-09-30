import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { NotificationCategory } from '@prisma/client';

const DAY_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async findAllForUser(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async findSecurityForUser(userId: string) {
    return this.prisma.activityLog.findMany({
      where: {
        userId,
        createdAt: { gte: new Date(Date.now() - 30 * DAY_MS) },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markAllSecurityRead(userId: string) {
    return this.prisma.activityLog.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }

  async markRead(userId: string, id: string) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { read: true },
    });
  }

  async markAllRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }

  async create(
    userId: string,
    data: {
      category: NotificationCategory;
      type: string;
      title: string;
      description: string;
    },
  ) {
    return this.prisma.notification.create({ data: { userId, ...data } });
  }

  async countUnreadForUser(userId: string) {
    const count = await this.prisma.notification.count({
      where: { userId, read: false },
    });
    return { count };
  }

  async notifyAllAdmins(data: {
    category: NotificationCategory;
    type: string;
    title: string;
    description: string;
  }) {
    const admins = await this.prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true },
    });

    if (admins.length === 0) return;

    await this.prisma.notification.createMany({
      data: admins.map((admin) => ({
        userId: admin.id,
        ...data,
      })),
    });
  }

  // Cleanup: read notifications older than 90 days
  async deleteOldRead() {
    return this.prisma.notification.deleteMany({
      where: {
        read: true,
        createdAt: { lt: new Date(Date.now() - 90 * DAY_MS) },
      },
    });
  }
}