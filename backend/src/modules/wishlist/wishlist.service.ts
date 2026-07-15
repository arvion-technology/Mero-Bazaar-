import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async toggle(userId: string, listingId: string) {
    const existing =  await this.prisma.wishlist.findUnique({
      where: { userId_listingId: { userId, listingId } },
    });
    if (existing) {
        await this.prisma.wishlist.delete({ where: { id: existing.id } });
        return { favorited: false };
    }
    await this.prisma.wishlist.create({ data: { userId, listingId } });
    return { favorited: true };
  }

  async findAllMine(userId: string) {
    return this.prisma.wishlist.findMany({
      where: { userId },
      include: {
        listing: {
          include: { vehicle: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async isFavorited(userId: string, listingId: string) {
    const existing = await this.prisma.wishlist.findUnique({
      where: { userId_listingId: { userId, listingId } },
    });
    return { favorited: !!existing };
  }

}
