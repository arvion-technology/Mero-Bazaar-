import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateListingDto } from './dto/create_listing.dto';
import { UpdateListingDto } from './dto/update_listing.dto';
import { SearchListingDto } from './dto/search_listing.dto';
import { buildListingFilter } from '../../search/builders/listings_filter.builder';
import { ListingCategory } from '@prisma/client';
import { assertVerifiedSeller } from '../../common/authz/seller-access';

//categorical assumed weights
type CategoryWeights = {
  price: number;
  subCategory: number;
  location: number;
};

const CATEGORY_WEIGHTS: Partial<Record<ListingCategory, CategoryWeights>> = {
  VEHICLE:     { price: 40, subCategory: 30, location: 30 },
  RENTAL:      { price: 35, subCategory: 20, location: 45 },
  AGRICULTURE: { price: 30, subCategory: 25, location: 45 },
  SECONDHAND:  { price: 45, subCategory: 35, location: 20 },
  JOB:         { price: 30, subCategory: 50, location: 20 },
  TRADES:      { price: 25, subCategory: 35, location: 40 },
  MEDICAL:     { price: 20, subCategory: 50, location: 30 },
  BEAUTY:      { price: 25, subCategory: 45, location: 30 },
  FOODS:       { price: 20, subCategory: 30, location: 50 },
};

const DEFAULT_WEIGHTS: CategoryWeights = { price: 35, subCategory: 30, location: 35 };

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

//for subcategories
function getSubCategoryValue(listing: any): string | string[] | null {
  switch (listing.category) {
    case 'VEHICLE':     return listing.vehicle?.type ?? null;
    case 'JOB':         return listing.job?.contractType ?? null;
    case 'MEDICAL':     return listing.medical?.serviceType ?? null;
    case 'TRADES':      return listing.trades?.skillTags ?? null;
    case 'RENTAL':      return listing.rental?.propertyType ?? null;
    case 'AGRICULTURE': return listing.agriculture?.listingType ?? null;
    case 'SECONDHAND':  return listing.secondhand?.category ?? null;
    case 'FOODS':       return listing.foods?.foodType ?? null;
    case 'BEAUTY':      return listing.beauty?.serviceType ?? null;
    default:            return null;
  }
}

function subCategoryMatch(a: string | string[] | null, b: string | string[] | null): number {
  if (!a || !b) return 0;
  if (Array.isArray(a) && Array.isArray(b)) {
    const overlap = a.filter((tag) => b.includes(tag)).length;
    return overlap / Math.max(a.length, b.length, 1);
  }
  return a === b ? 1 : 0;
}

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateListingDto, userId: string) {
    await assertVerifiedSeller(this.prisma, userId);
    return this.prisma.listing.create({
      data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
        userId,
        category: dto.category,
        images: dto.images,
        latitude: dto.latitude,
        longitude: dto.longitude,
        location: dto.location,
      },
    });
  }

  findAll() {
    return this.prisma.listing.findMany({
      include: {
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
  }

  async findOne(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        vehicle: true,
        job: true,
        medical: true,
        trades: true,
        rental: true,
        agriculture: true,
        secondhand: true,
        foods: true,
        beauty: true,
        reviews: true,
        user: {
          select: {
            name: true,
            image: true,
            phone: true,
            createdAt: true,
            vendorProfile: {
              select: { isVerified: true },
            },
            _count: {
              select: { listings: true },
            },
          },
        },
      },
    });

    if (!listing) return null;

    const sellerRatingAgg = await this.prisma.review.aggregate({
      where: { listing: { userId: listing.userId } },
      _avg: { rating: true },
      _count: { rating: true },
    });

    return {
      ...listing,
      sellerRating: sellerRatingAgg._avg.rating ?? 0,
      sellerReviewCount: sellerRatingAgg._count.rating,
    };
  }

  async findAllMine(userId: string) {
    return this.prisma.listing.findMany({
      where: { userId },
      include: {
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
      orderBy: { createdAt: 'desc' },
    });
  }
  async update(id: string, dto: UpdateListingDto, userId: string) {
    return this.prisma.listing.update({
      where: { id, userId },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description && { description: dto.description }),
        ...(dto.price !== undefined && { price: dto.price }),
        ...(dto.images !== undefined && { images: dto.images }),
        ...(dto.latitude !== undefined && { latitude: dto.latitude }),
        ...(dto.longitude !== undefined && { longitude: dto.longitude }),
        ...(dto.location !== undefined && { location: dto.location }),
      },
    });
  }

  async remove(id: string, userId: string) {
    return this.prisma.listing.delete({
      where: { id, userId },
    });
  }

  async getMyStats(userId: string) {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [totalProducts, productsThisMonth, productsLastMonth] =
      await Promise.all([
        this.prisma.listing.count({ where: { userId } }),
        this.prisma.listing.count({
          where: { userId, createdAt: { gte: startOfThisMonth } },
        }),
        this.prisma.listing.count({
          where: {
            userId,
            createdAt: { gte: startOfLastMonth, lt: startOfThisMonth },
          },
        }),
      ]);
    return { totalProducts, productsThisMonth, productsLastMonth };
  }

  async search(query: SearchListingDto) {
    const where = buildListingFilter(query);

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    return this.prisma.listing.findMany({
      where: {
        ...where,

        id: query.exclude ? { not: query.exclude } : undefined,
      },

      include: {
        vehicle: true,
        job: true,
        medical: true,
      },

      orderBy: {
        createdAt: 'desc',
      },

      take: limit,
      skip: (page - 1) * limit,
    });
  }

  async getRelated(category: ListingCategory, exclude: string, limit: number) {
    return this.prisma.listing.findMany({
      where: {
        category,
        id: exclude ? { not: exclude } : undefined,
      },
      include: {
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
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
   
 async getSimilarListings(listingId: string, limit = 6) {
  const listing = await this.prisma.listing.findUnique({
    where: { id: listingId },
    include: {
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
  if (!listing) return [];

  const weights = CATEGORY_WEIGHTS[listing.category] ?? DEFAULT_WEIGHTS;
  const refSubCat = getSubCategoryValue(listing);

  const candidates = await this.prisma.listing.findMany({
    where: {
      category: listing.category,
      id: { not: listingId },
    },
    include: {
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
    take: 50,
  });

  const scored = candidates.map((c) => {
    let score = 0;

    if (listing.price && c.price) {
      const priceDiff = Math.abs(c.price - listing.price) / listing.price;
      score += Math.max(0, 1 - priceDiff) * weights.price;
    }

    const candSubCat = getSubCategoryValue(c);
    score += subCategoryMatch(refSubCat, candSubCat) * weights.subCategory;

    if (listing.latitude && listing.longitude && c.latitude && c.longitude) {
      const dist = haversineKm(listing.latitude, listing.longitude, c.latitude, c.longitude);
      score += Math.max(0, 1 - dist / 50) * weights.location;
    }

    return { ...c, score };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}
}