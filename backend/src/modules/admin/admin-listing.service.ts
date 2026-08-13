import { Injectable, NotFoundException } from '@nestjs/common';
import { ListingCategory, ListingStatus } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

const DETAIL_SELECT = {
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
} as const;

@Injectable()
export class AdminListingService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

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
      select: DETAIL_SELECT,
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

  async updateListing(id: string, body: Record<string, any>) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });
    if (!listing) throw new NotFoundException('Listing not found.');

    const categoryKey = listing.category.toLowerCase();
    const { title, description, price, status, [categoryKey]: categoryData } = body;

    const data: Record<string, any> = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (price !== undefined) data.price = price;
    if (status !== undefined) data.status = status;

    if (categoryData && typeof categoryData === 'object' && !Array.isArray(categoryData)) {
      data[categoryKey] = { update: categoryData };
    }

    return this.prisma.listing.update({
      where: { id },
      data,
      select: DETAIL_SELECT,
    });
  }

  async deleteListing(id: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });
    if (!listing) throw new NotFoundException('Listing not found.');

    await this.prisma.listing.delete({ where: { id } });

    await this.notificationsService.notifyAllAdmins({
      category: 'SYSTEM',
      type: 'LISTING_DELETED',
      title: 'Listing deleted',
      description: `"${listing.title}" was removed.`,
    });
    return { id, deleted: true };
  }
}