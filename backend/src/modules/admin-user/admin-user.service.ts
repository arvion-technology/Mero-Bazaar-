import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRole } from "@prisma/client";
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AdminUserService {
  constructor(private prisma: PrismaService) {}

  async listUsers(role?: UserRole) {
    return this.prisma.user.findMany({
      where: role ? { role } : undefined,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
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
        },
    });
    if (!user) throw new NotFoundException('User not found. ');
    return user;
  }
  async setActive(userId: string, adminId: string, isActive: boolean) {
    if (userId === adminId && !isActive) {
      throw new BadRequestException('You cannot deactivate your own account.');
    }
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive },
      select: { id: true, isActive: true },
    });
  }
}
