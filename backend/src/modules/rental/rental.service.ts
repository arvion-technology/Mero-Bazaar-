import { Injectable, NotFoundException } from '@nestjs/common';
import { ListingCategory, Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

import { CreateRentalDto } from './dto/create_rental.dto';
import { UpdateRentalDto } from './dto/update_rental.dto';
import { QueryRentalDto } from './dto/query_rental.dto';

@Injectable()
export class RentalService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateRentalDto) {
    return this.prisma.listing.create({
      data: {
        title: `${dto.propertyType} in ${dto.city}`,
        category: ListingCategory.RENTAL,
        description: dto.description,
        price: dto.price,
        images: dto.images ?? [],

        rental: {
          create: {
            propertyType: dto.propertyType,
            listingType: dto.listingType,
            city: dto.city,
            area: dto.area,
            ward: dto.ward,
            address: dto.address,
            latitude: dto.latitude,
            longitude: dto.longitude,
            monthlyRent: dto.monthlyRent,
            depositAmount: dto.depositAmount,
            bedrooms: dto.bedrooms,
            bathrooms: dto.bathrooms,
            squareFeet: dto.squareFeet,

            furnished: dto.furnished ?? false,
            parkingAvailable: dto.parkingAvailable ?? false,
            wifiAvailable: dto.wifiAvailable ?? false,
            waterIncluded: dto.waterIncluded ?? false,
            electricityIncluded: dto.electricityIncluded ?? false,
            petFriendly: dto.petFriendly ?? false,

            availableFrom: dto.availableFrom
              ? new Date(dto.availableFrom)
              : null,

            isOwnerOrAgent: dto.isOwnerOrAgent,
            noBroker: dto.noBroker ?? false,

            nearbyLandmarks: dto.nearbyLandmarks ?? [],
            rules: dto.rules ?? [],
          },
        },
      },
      include: {
        rental: true,
      },
    });
  }

  async findAll(query: QueryRentalDto) {
    const orFilter: Prisma.ListingWhereInput[] | undefined = query.search
      ? [
          {
            rental: {
              is: {
                city: {
                  contains: query.search,
                  mode: 'insensitive',
                },
              },
            },
          },
          {
            rental: {
              is: {
                area: {
                  contains: query.search,
                  mode: 'insensitive',
                },
              },
            },
          },
          {
            description: {
              contains: query.search,
              mode: 'insensitive',
            },
          },
        ]
      : undefined;

    return this.prisma.listing.findMany({
      where: {
        category: ListingCategory.RENTAL,

        ...(orFilter ? { OR: orFilter } : {}),

        rental: {
          is: {
            city: query.city ?? undefined,
            area: query.area ?? undefined,
            propertyType: query.propertyType ?? undefined,
            listingType: query.listingType ?? undefined,
            furnished: query.furnished ?? undefined,
            petFriendly: query.petFriendly ?? undefined,

            monthlyRent:
              query.minRent || query.maxRent
                ? {
                    gte: query.minRent ?? undefined,
                    lte: query.maxRent ?? undefined,
                  }
                : undefined,
          },
        },
      },
      include: {
        rental: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: { rental: true },
    });

    if (!listing || listing.category !== ListingCategory.RENTAL) {
      throw new NotFoundException('Rental not found');
    }

    return listing;
  }

  async update(id: string, dto: UpdateRentalDto) {
    await this.findOne(id);

    return this.prisma.listing.update({
      where: { id },
      data: {
        description: dto.description,
        price: dto.price,
        images: dto.images,

        rental: {
          update: {
            propertyType: dto.propertyType,
            listingType: dto.listingType,
            city: dto.city,
            area: dto.area,
            ward: dto.ward,
            address: dto.address,
            latitude: dto.latitude,
            longitude: dto.longitude,
            monthlyRent: dto.monthlyRent,
            depositAmount: dto.depositAmount,
            bedrooms: dto.bedrooms,
            bathrooms: dto.bathrooms,
            squareFeet: dto.squareFeet,

            furnished: dto.furnished,
            parkingAvailable: dto.parkingAvailable,
            wifiAvailable: dto.wifiAvailable,
            waterIncluded: dto.waterIncluded,
            electricityIncluded: dto.electricityIncluded,
            petFriendly: dto.petFriendly,

            availableFrom: dto.availableFrom
              ? new Date(dto.availableFrom)
              : undefined,

            isOwnerOrAgent: dto.isOwnerOrAgent,
            noBroker: dto.noBroker,

            nearbyLandmarks: dto.nearbyLandmarks,
            rules: dto.rules,
          },
        },
      },
      include: {
        rental: true,
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