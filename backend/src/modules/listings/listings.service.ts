import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateListingDto } from './dto/create_listing.dto';
import { UpdateListingDto } from './dto/update_listing.dto';

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
        },
      });

      if (dto.category === 'VEHICLE' && dto.vehicle) {
        await tx.vehicle.create({
          data: {
            listingId: listing.id,
            ...dto.vehicle,
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
        title: dto.title,
        description: dto.description,
        price: dto.price,
        category: dto.category,
        images: dto.images,
      },
      include:{
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
}