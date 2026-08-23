import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { NotificationCategory } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async findAllForUser(userId: string) {
    return this.prisma.notification.findMany({
<<<<<<< HEAD
      where: { userId },
      orderBy: { createdAt: 'desc' },
=======
        where: { userId },
        orderBy: { createdAt: 'desc' },
>>>>>>> origin/aashika
    });
  }

  async findSecurityForUser(userId: string) {
    return this.prisma.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAllSecurityRead(userId: string) {
    return this.prisma.activityLog.updateMany({
      where: { userId, read: false },
      data: { read: true },
<<<<<<< HEAD
    });
=======
    })
>>>>>>> origin/aashika
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

<<<<<<< HEAD
  async create(
    userId: string,
    data: {
      category: NotificationCategory;
      type: string;
      title: string;
      description: string;
    },
  ) {
=======
  async create(userId: string, data: { category: NotificationCategory; type: string; title: string; description: string }) {
>>>>>>> origin/aashika
    return this.prisma.notification.create({ data: { userId, ...data } });
  }

  async countUnreadForUser(userId: string) {
    const count = await this.prisma.notification.count({
      where: { userId, read: false },
    });
    return { count };
  }

<<<<<<< HEAD
  async notifyAllAdmins(data: {
    category: NotificationCategory;
    type: string;
    title: string;
    description: string;
  }) {
=======
  async notifyAllAdmins(data: { category: NotificationCategory; type: string; title: string; description: string }) {
>>>>>>> origin/aashika
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
}
