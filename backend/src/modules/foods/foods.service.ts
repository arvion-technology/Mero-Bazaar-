import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateFoodsAndHomeDeliveryDto } from './dto/create_foods.dto';
import { ListingCategory } from '@prisma/client';
import { QueryFoodsAndHomeDeliveryDto } from './dto/query_foods.dto';
import { UpdateFoodsAndHomeDeliveryDto } from './dto/update_foods.dto';

@Injectable()
export class FoodsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateFoodsAndHomeDeliveryDto, userId: string) {
    return this.prisma.listing.create({
      data: {
        title: dto.title,
        category: ListingCategory.FOODS,
        description: dto.description,
        price: dto.price,
        images: [],
        user: {
          connect: { id: userId },
        },
        foods: {
          create: {
            foodType: dto.foodType,
            priceUnit: dto.priceUnit,
            price: dto.price,
            deliveryDays: dto.deliveryDays,
          },
        },
      },
      include: { foods: true },
    });
  }

  async findAll(query: QueryFoodsAndHomeDeliveryDto) {
    return this.prisma.listing.findMany({
      where: {
        category: ListingCategory.FOODS,
        foods: {
          is: {
            ...(query.foodType && { foodType: query.foodType }),
            ...(query.priceUnit && { priceUnit: query.priceUnit }),
          },
        },
      },
      include: { foods: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        foods: true,
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

    if (!listing || listing.category !== ListingCategory.FOODS) {
      throw new NotFoundException('Foods and home delivery listing not found');
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

  async update(id: string, dto: UpdateFoodsAndHomeDeliveryDto, userId: string) {
    const listing = await this.findOne(id);

    if (listing.userId !== userId) {
      throw new ForbiddenException('Unauthorized');
    }

    return this.prisma.listing.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
        foods: {
          update: {
            foodType: dto.foodType,
            price: dto.price,
            priceUnit: dto.priceUnit,
            deliveryDays: dto.deliveryDays,
          },
        },
      },
      include: { foods: true },
    });
  }

  async remove(id: string, userId: string) {
    const listing = await this.findOne(id);

    if (listing.userId !== userId) {
      throw new ForbiddenException('Unauthorized');
    }

    return this.prisma.listing.delete({ where: { id } });
  }

  async addPhotos(id: string, files: Express.Multer.File[], userId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: { foods: true },
    });

    if (!listing || listing.userId !== userId) {
      throw new ForbiddenException('Unauthorized');
    }

    if (!listing.foods) {
      throw new NotFoundException('Foods listing not found');
    }

    const newPhotoUrls = files.map((file) => `/uploads/foods/${file.filename}`);
    const updatedImages = [...listing.images, ...newPhotoUrls];

    return this.prisma.listing.update({
      where: { id },
      data: { images: updatedImages },
      include: { foods: true },
    });
  }
}