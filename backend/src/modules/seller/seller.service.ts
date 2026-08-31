import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

const MAX_PAGE_SIZE = 50;

function clampPagination(page: number, take: number, defaultTake: number) {
  const safePage = Number.isFinite(page) && page >= 1 ? Math.floor(page) : 1;
  const safeTake =
    Number.isFinite(take) && take >= 1
      ? Math.min(Math.floor(take), MAX_PAGE_SIZE)
      : defaultTake;
  return { safePage, safeTake };
}

@Injectable()
export class SellersService {
  constructor(private prisma: PrismaService) {}

  async getSellerProfile(sellerId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: sellerId },
      select: {
        id: true,
        name: true,
        image: true,
        isVerified: true,
        createdAt: true,
        vendorProfile: {
          select: {
            businessName: true,
            businessType: true,
            description: true,
            address: true,
            isVerified: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('Seller not found');

    const [ratingAgg, totalListings] = await Promise.all([
      this.prisma.review.aggregate({
        where: { listing: { userId: sellerId } },
        _avg: { rating: true },
        _count: { rating: true },
      }),
      this.prisma.listing.count({ where: { userId: sellerId } }),
    ]);

    return {
      id: user.id,
      name: user.name,
      avatar: user.image,
      isVerified: user.isVerified,
      memberSince: user.createdAt,
      business: user.vendorProfile
        ? {
            name: user.vendorProfile.businessName,
            type: user.vendorProfile.businessType, // INDIVIDUAL | COMPANY | AGENCY
            description: user.vendorProfile.description,
            address: user.vendorProfile.address,
            isVerified: user.vendorProfile.isVerified,
          }
        : null,
      rating: ratingAgg._avg.rating ?? 0,
      reviewCount: ratingAgg._count.rating,
      totalListings,
    };
  }

  async getSellerListings(sellerId: string, page = 1, take = 12) {
    const { safePage, safeTake } = clampPagination(page, take, 12);
    const [listings, total] = await Promise.all([
      this.prisma.listing.findMany({
        where: { userId: sellerId },
        orderBy: { createdAt: 'desc' },
        skip: (safePage - 1) * safeTake,
        take: safeTake,
        select: {
          id: true,
          title: true,
          price: true,
          images: true,
          category: true,
          createdAt: true,
        },
      }),
      this.prisma.listing.count({ where: { userId: sellerId } }),
    ]);

    return { data: listings, total, page: safePage, pageSize: safeTake };
  }

  async getSellerReviews(sellerId: string, page = 1, take = 10) {
    const { safePage, safeTake } = clampPagination(page, take, 10);
    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { listing: { userId: sellerId } },
        orderBy: { createdAt: 'desc' },
        skip: (safePage - 1) * safeTake,
        take: safeTake,
        include: {
          user: { select: { name: true, image: true } },
          listing: { select: { id: true, title: true } },
        },
      }),
      this.prisma.review.count({ where: { listing: { userId: sellerId } } }),
    ]);

    return {
      data: reviews.map((r) => ({
        id: r.id,
        reviewerName: r.reviewerName ?? r.user.name ?? 'Anonymous',
        reviewerAvatar: r.user.image,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        listingId: r.listing.id,
        listingTitle: r.listing.title,
      })),
      total,
      page: safePage,
      pageSize: safeTake,
    };
  }
}
