import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ListingCategory } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

import { CreateTradesDto } from './dto/create_trades.dto';
import { QueryTradesDto } from './dto/query_trades.dto';
import { CreateLeadDto } from '../leads/dto/create_lead.dto';
import { UpdateTradesDto } from './dto/update_trades.dto';
import { validateAndReencodeImage } from '../../common/uploads/upload.utils';
import { assertVerifiedSeller } from '../../common/authz/seller-access';

@Injectable()
export class TradesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTradesDto, userId: string) {
    await assertVerifiedSeller(this.prisma, userId);
    return this.prisma.listing.create({
      data: {
        category: ListingCategory.TRADES,
        title: dto.title,
        description: dto.description,
        location: dto.city,
        latitude: dto.latitude,
        longitude: dto.longitude,
        images: [],
        user: {
          connect: {
            id: userId,
          },
        },
        trades: {
          create: {
            city: dto.city,
            ward: dto.ward,
            skillTags: dto.skillTags,
            serviceAreaKm: dto.serviceAreaKm,
            calloutCharge: dto.calloutCharge,
            emergencyAvailable: dto.emergencyAvailable,
            warrantyGiven: dto.warrantyGiven,
          },
        },
      },
      include: {
        trades: true,
      },
    });
  }

  async findAll(query: QueryTradesDto) {
    return this.prisma.listing.findMany({
      where: {
        category: ListingCategory.TRADES,
        trades: {
          city: query.city,
          emergencyAvailable: query.emergency,
          skillTags: query.skill ? { has: query.skill } : undefined,
        },
      },
      include: {
        trades: true,
      },
    });
  }

  async emergency(city?: string) {
    return this.prisma.listing.findMany({
      where: {
        category: ListingCategory.TRADES,
        trades: {
          emergencyAvailable: true,
          city,
        },
      },
      include: {
        trades: true,
      },
    });
  }

  async createLead(listingId: string, dto: CreateLeadDto, userId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      select: { id: true, category: true },
    });

    // A lead may only reference an existing TRADES listing; silently accepting
    // arbitrary listing ids would let callers create orphaned/invalid leads.
    if (!listing || listing.category !== ListingCategory.TRADES) {
      throw new NotFoundException('Trades listing not found');
    }

    return this.prisma.lead.create({
      data: {
        listingId,
        leadType: dto.leadType,
        userId,
      },
    });
  }

  async findOne(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        trades: true,
        user: {
          select: {
            id: true,
            name: true,
            isVerified: true,
            phone: true,
            createdAt: true,
            vendorProfile: {
              select: { businessName: true, rating: true },
            },
          },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!listing || listing.category !== ListingCategory.TRADES) {
      throw new NotFoundException('Trades listing not found');
    }

    const [totalListing, reviewAgg] = await Promise.all([
      this.prisma.listing.count({ where: { userId: listing.userId } }),
      this.prisma.review.aggregate({
        where: { listing: { userId: listing.userId } },
        _avg: { rating: true },
        _count: { rating: true },
      }),
    ]);

    return {
      ...listing,
      sellerTotalListing: totalListing,
      sellerRating: reviewAgg._avg.rating ?? 0,
      sellerReviewCount: reviewAgg._count.rating,
    };
  }

  async nearby(lat: number, lng: number, km: number) {
    return this.geoSearchNearby(lat, lng, km);
  }

  private async geoSearchNearby(lat: number, lng: number, km: number) {
    // Bound the search radius so a huge `km` cannot collapse the bounding box
    // into a full-table scan of every trades listing.
    const MAX_NEARBY_RADIUS_KM = 100;
    const radiusKm = Number.isFinite(km)
      ? Math.min(Math.max(km, 0), MAX_NEARBY_RADIUS_KM)
      : 0;
    const range = radiusKm / 111;

    return this.prisma.listing.findMany({
      where: {
        category: ListingCategory.TRADES,
        latitude: {
          gte: lat - range,
          lte: lat + range,
        },
        longitude: {
          gte: lng - range,
          lte: lng + range,
        },
      },
      include: {
        trades: true,
      },
    });
  }

  async update(id: string, dto: UpdateTradesDto, userId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
    });

    if (!listing || listing.userId !== userId) {
      throw new ForbiddenException('Unauthorized');
    }

    return this.prisma.listing.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        location: dto.city,
        trades: {
          update: {
            city: dto.city,
            skillTags: dto.skillTags,
            serviceAreaKm: dto.serviceAreaKm,
            calloutCharge: dto.calloutCharge,
            emergencyAvailable: dto.emergencyAvailable,
            warrantyGiven: dto.warrantyGiven,
            avgResponseHours: dto.avgResponseHours,
          },
        },
      },
      include: {
        trades: true,
      },
    });
  }
  async remove(id: string, userId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
    });

    if (!listing || listing.userId !== userId) {
      throw new ForbiddenException('Unauthorized');
    }

    return this.prisma.listing.delete({
      where: { id },
    });
  }

  async addPhotos(id: string, files: Express.Multer.File[], userId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: { trades: true },
    });

    if (!listing || listing.userId !== userId) {
      throw new ForbiddenException('Unauthorized');
    }

    if (!listing.trades) {
      throw new NotFoundException('Trades listing not found');
    }

    const newPhotoNames: string[] = [];
    for (const file of files) {
      const finalName = await validateAndReencodeImage(
        file.path,
        './uploads/trades',
      );
      newPhotoNames.push(finalName);
    }

    const newPhotoUrls = newPhotoNames.map((name) => `/uploads/trades/${name}`);
    const updatedImages = [...listing.images, ...newPhotoUrls];

    return this.prisma.listing.update({
      where: { id },
      data: { images: updatedImages },
      include: { trades: true },
    });
  }
}
