import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateHairBeautyAndWellnessDto } from './dto/create_beauty.dto';
import { UpdateHairBeautyAndWellnessDto } from './dto/update_beauty.dto';
import { ListingCategory } from '@prisma/client';

@Injectable()
export class HairBeautyAndWellnessService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateHairBeautyAndWellnessDto, userId: string) {
    return this.prisma.listing.create({
      data: {
        title: `${dto.serviceType} Service`,
        category: ListingCategory.BEAUTY,
        description: dto.city
          ? `${dto.serviceType} available in ${dto.city}`
          : `${dto.serviceType} service`,
        images: dto.portfolioUrls ?? [],
        user: {
          connect: {
            id: userId,
          },
        },
        beauty: {
          create: {
            serviceType: dto.serviceType,
            price: dto.price,
            priceStartingFrom: dto.priceStartingFrom,
            homeVisit: dto.homeVisit,
            portfolioUrls: dto.portfolioUrls,
            bridalAvailable: dto.bridalAvailable,
            city: dto.city,
          },
        },
      },
      include: {
        beauty: true,
      },
    });
  }

  async findAll() {
    return this.prisma.listing.findMany({
      where: {
        category: ListingCategory.BEAUTY,
      },
      include: {
        beauty: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const beauty = await this.prisma.hairBeautyAndWellness.findFirst({
      where: { listingId: id },
      include: {
        listing: true,
      },
    });

    if (!beauty) {
      throw new NotFoundException('Hair Beauty & Wellness listing not found');
    }

    return beauty;
  }
  
  async update(id: string, dto: UpdateHairBeautyAndWellnessDto, userId: string) {
    await this.findOne(id);

    return this.prisma.listing.update({
      where: { id, userId },
      data: {
        description: dto.city
          ? `${dto.serviceType ?? ''} available in ${dto.city}`
          : undefined,

        price: dto.price,

        images: dto.portfolioUrls ?? undefined,

        beauty: {
          update: {
            serviceType: dto.serviceType,
            price: dto.price,
            priceStartingFrom: dto.priceStartingFrom,
            homeVisit: dto.homeVisit,
            portfolioUrls: dto.portfolioUrls,
            bridalAvailable: dto.bridalAvailable,
            city: dto.city,
          },
        },
      },
      include: {
        beauty: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id);

    return this.prisma.listing.delete({
      where: { id, userId },
    });
  }
}