import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateFoodsAndHomeDeliveryDto } from './dto/create_foods.dto';
import { FoodType, ListingCategory, PriceUnit } from '@prisma/client';
import { QueryFoodsAndHomeDeliveryDto } from './dto/query_foods.dto';
import { UpdateFoodsAndHomeDeliveryDto } from './dto/update_foods.dto';

@Injectable()
export class FoodsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateFoodsAndHomeDeliveryDto) {
    return this.prisma.listing.create({
      data: {
        title: `${dto.foodType || 'Food'} Delivery`,
        category: ListingCategory.FOODS,
        description: `Food delivery service`,
        price: dto.price,
        images: [],

      foods: {
          create: {
            foodType: dto.foodType,
            priceUnit: dto.priceUnit,
            price: dto.price,
            deliveryRadiusKm: dto.deliveryRadiusKm,
            subscriptionAvailable: dto.subscriptionAvailable,
            deliveryDays: dto.deliveryDays,
            minOrderAmount: dto.minOrderAmount,
          },
        },
      },
      include: {
      foods: true,
      },
    });
  }

  async findAll(query: QueryFoodsAndHomeDeliveryDto) {
    return this.prisma.listing.findMany({
      where: {
        category: ListingCategory.FOODS,

      foods: {
          is: {
            ...(query.foodType && {
              foodType: query.foodType,
            }),
            ...(query.priceUnit && {
              priceUnit: query.priceUnit,
            }),
            ...(query.subscriptionAvailable !== undefined && {
                subscriptionAvailable: query.subscriptionAvailable,
            }),
          },
        },
      },
      include: {
      foods: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  async findOne(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
      foods: true,
      },
    });
    if (!listing || listing.category !== ListingCategory.FOODS) {
      throw new NotFoundException('Foods and home delivery listing not found');
    }
    return listing;
  }
  async update(id: string, dto: UpdateFoodsAndHomeDeliveryDto) {
    await this.findOne(id);

    return this.prisma.listing.update({
      where: { id },
      data: {
        price: dto.price,
      foods: {
          update: {
            foodType: dto.foodType,
            price: dto.price,
            priceUnit: dto.priceUnit,
            deliveryRadiusKm: dto.deliveryRadiusKm,
            subscriptionAvailable: dto.subscriptionAvailable,
            deliveryDays: dto.deliveryDays,
            minOrderAmount: dto.minOrderAmount,
          },
        },
      },
      include: {
      foods: true,
      },
    });
  }
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.listing.delete({
      where: { id },
    });
  }
}

