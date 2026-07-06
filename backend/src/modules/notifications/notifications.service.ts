import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { NotificationCategory } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async findAllForUser(userId: string) {
    return this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
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

  async create(userId: string, data: { category: NotificationCategory; type: string; title: string; description: string }) {
    return this.prisma.notification.create({ data: { userId, ...data } });
  }
}
