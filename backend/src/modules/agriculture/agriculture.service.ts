import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateAgricultureDto } from './dto/create_agriculture.dto';
import { UpdateAgricultureDto } from './dto/update_agriculture.dto';
import { ListingCategory } from '@prisma/client';
import { QueryAgricultureDto } from './dto/query_agriculture.dto';

@Injectable()
export class AgricultureService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAgricultureDto) {
    return this.prisma.listing.create({
      data: {
        title: `${dto.listingType} in ${dto.district}`,
        category: ListingCategory.AGRICULTURE,
        description: dto.location,
        price: dto.pricePerUnit,
        images: [],

        agriculture: {
          create: {
            listingType: dto.listingType,
            district: dto.district,
            village: dto.village,
            location: dto.location,
            pricePerUnit: dto.pricePerUnit,
            unit: dto.unit,

            organicCertified: dto.organicCertified,
            organicVerified: dto.organicVerified,
            seasonalAvailability: dto.seasonalAvailability,

            animalType: dto.animalType,
            breed: dto.breed,
            age: dto.age,
            healthVaccineStatus: dto.healthVaccineStatus,
          },
        },
      },
      include: {
        agriculture: true,
      },
    });
  }

  async findAll(query: QueryAgricultureDto) {
    return this.prisma.listing.findMany({
      where: {
        category: ListingCategory.AGRICULTURE,

        agriculture: {
          is: {
            ...(query.listingType && { listingType: query.listingType }),
            ...(query.unit && { unit: query.unit }),
            ...(query.district && { district: query.district }),
          },
        },
      },
      include: {
        agriculture: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: { agriculture: true },
    });

    if (!listing || listing.category !== ListingCategory.AGRICULTURE) {
      throw new NotFoundException('Agriculture listing not found');
    }

    return listing;
  }

  async update(id: string, dto: UpdateAgricultureDto) {
    await this.findOne(id);

    return this.prisma.listing.update({
      where: { id },
      data: {
        description: dto.location,
        price: dto.pricePerUnit,

        agriculture: {
          update: {
            listingType: dto.listingType,
            district: dto.district,
            village: dto.village,
            location: dto.location,
            pricePerUnit: dto.pricePerUnit,
            unit: dto.unit,

            organicCertified: dto.organicCertified,
            organicVerified: dto.organicVerified,
            seasonalAvailability: dto.seasonalAvailability,

            animalType: dto.animalType,
            breed: dto.breed,
            age: dto.age,
            healthVaccineStatus: dto.healthVaccineStatus,
          },
        },
      },
      include: {
        agriculture: true,
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