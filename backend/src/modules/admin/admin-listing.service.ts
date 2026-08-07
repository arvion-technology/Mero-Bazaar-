import { Injectable, NotFoundException } from '@nestjs/common';
import { ListingCategory, ListingStatus } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AdminListingService {
  constructor(private prisma: PrismaService) {}

  async listListings(category?: ListingCategory, status?: ListingStatus) {
    return this.prisma.listing.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(status ? { status } : {}),
      },
      select: {
        id: true,
        title: true,
        price: true,
        category: true,
        status: true,
        images: true,
        createdAt: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getListingById(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        category: true,
        status: true,
        images: true,
        latitude: true,
        longitude: true,
        createdAt: true,
        updatedAt: true,
        user: { select: { id: true, name: true, email: true, phone: true } },
        vehicle: true,
        job: true,
        medical: true,
        trades: true,
        rental: true,
        agriculture: true,
        secondhand: true,
        foods: true,
        beauty: true,
      },
    });
    if (!listing) throw new NotFoundException('Listing not found.');
    return listing;
  }

  async setStatus(id: string, status: ListingStatus) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });
    if (!listing) throw new NotFoundException('Listing not found.');

    return this.prisma.listing.update({
      where: { id },
      data: { status },
      select: { id: true, status: true },
    });
  }
}