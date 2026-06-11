import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateListingDto } from './dto/create_listing.dto';
import { UpdateListingDto } from './dto/update_listing.dto';
import { SearchListingDto } from './dto/search_listing.dto';
import { buildListingFilter } from '../../search/builders/listings_filter.builder';
import { ListingCategory } from '@prisma/client';

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateListingDto, userId: string) {
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
      },
    });
  }

  findAll() {
    return this.prisma.listing.findMany({
      include: {
        vehicle: true,
        job: true,
        medical: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.listing.findUnique({
      where: { id },
      include: {
        vehicle: true,
        job: true,
        medical: true,
      },
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
      },
    });
  }

  async remove(id: string, userId: string) {
    return this.prisma.listing.delete({
      where: { id, userId },
    });
  }

async search(query: SearchListingDto) {
  const where = buildListingFilter(query);

  const page = query.page ?? 1;
  const limit = query.limit ?? 10;

  return this.prisma.listing.findMany({
    where: {
      ...where,

      id: query.exclude
        ? { not: query.exclude }
        : undefined,
    },

    include: {
      vehicle: true,
      job: true,
      medical: true,
    },

    orderBy: {
      createdAt: "desc",
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
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
  });
}
}