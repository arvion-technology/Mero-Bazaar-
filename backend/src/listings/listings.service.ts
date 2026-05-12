import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateListingDto } from './dto/create_listing.dto';
import { UpdateListingDto } from './dto/update_listing.dto';
import { SearchListingDto } from './dto/search_listing.dto';
import { buildListingFilter } from './builders/listings_filter.builder';
import { ListingCategory } from '@prisma/client';

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateListingDto) {
    return this.prisma.$transaction(async (tx) => {
      const listing = await tx.listing.create({
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

      if (dto.category === ListingCategory.VEHICLE && dto.vehicle) {
        await tx.vehicle.create({
          data: {
            listingId: listing.id,

            type: dto.vehicle.type,
            brand: dto.vehicle.brand,
            model: dto.vehicle.model,
            year: dto.vehicle.year,
            km_driven: dto.vehicle.km_driven,
            condition: dto.vehicle.condition,
            bluebook_status: dto.vehicle.bluebook_status,
            fuel_type: dto.vehicle.fuel_type,
            ownership_transfer_ready: dto.vehicle.ownership_transfer_ready ?? false,
          },
        });
      }

      return listing;
    });
  }

  findAll() {
    return this.prisma.listing.findMany({
      include: {
        vehicle: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.listing.findUnique({
      where: { id },
      include: {
        vehicle: true,
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
        ...(dto.category && { category: dto.category }),
        ...(dto.images !== undefined && { images: dto.images }),
      },
      include: {
        vehicle: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.$transaction(async (tx) => {
      await tx.vehicle.deleteMany({
        where: { listingId: id },
      });

      return tx.listing.delete({
        where: { id },
      });
    });
  }

  async search(query: SearchListingDto) {
    const where = buildListingFilter(query);

    return this.prisma.listing.findMany({
      where,
      include: {
        vehicle: true,
      },
    });
  }
}