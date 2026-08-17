import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRole, VerificationStatus } from "@prisma/client";
import { PrismaService } from 'src/database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AdminUserService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
) {}

  async listUsers(role?: UserRole, kycStatus?: VerificationStatus | 'NOT_SUBMITTED') {
    const users = await this.prisma.user.findMany({
      where: role ? { role } : undefined,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        vendorKyc: { select: { status: true, submittedAt: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!kycStatus) return users;
    if (kycStatus === 'NOT_SUBMITTED') return users.filter((u) => !u.vendorKyc);
    return users.filter((u) => u.vendorKyc?.status === kycStatus);
  }

  async getUsersById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        vendorProfile: true,
        doctorProfile: true,
        vendorKyc: true,
      },
    });
    if (!user) throw new NotFoundException('User not found. ');
      
    if (user.vendorProfile) {
    const agg = await this.prisma.review.aggregate({
      where: { listing: { userId: user.id } },
      _avg: { rating: true },
      _count: { rating: true },
    });
    (user.vendorProfile as any).liveRating = agg._avg.rating ?? 0;
    (user.vendorProfile as any).reviewCount = agg._count.rating;
  }
    return user;
  }

  async setActive(userId: string, adminId: string, isActive: boolean) {
    if (userId === adminId && !isActive) {
      throw new BadRequestException('You cannot deactivate your own account.');
    }
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive },
      select: { id: true, isActive: true },
    });

    if (!isActive) {
      await this.notificationsService.notifyAllAdmins({
        category: 'SYSTEM',
        type: 'USER_DEACTIVATED',
        title: 'User deactivated',
        description: `${user.name ?? user.email} was deactivated.`,
      });
    }

    return updated;
  }
}