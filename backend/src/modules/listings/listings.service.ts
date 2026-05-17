import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateListingDto } from './dto/create_listing.dto';
import { UpdateListingDto } from './dto/update_listing.dto';
import { SearchListingDto } from './dto/search_listing.dto';
import { buildListingFilter } from '../../search/builders/listings_filter.builder';

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateListingDto) {
    return this.prisma.listing.create({
      data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
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

  async update(id: string, dto: UpdateListingDto) {
    return this.prisma.listing.update({
      where: { id },
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

  async remove(id: string) {
    return this.prisma.listing.delete({
      where: { id },
    });
  }

  async search(query: SearchListingDto) {
    const where = buildListingFilter(query);

    return this.prisma.listing.findMany({
      where,
      include: {
        vehicle: true,
        job: true,
        medical: true,
      },
    });
  }
}