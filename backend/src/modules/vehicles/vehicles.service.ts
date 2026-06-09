import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateVehicleDto } from './dto/create_vehicle.dto';
import { UpdateVehicleDto } from './dto/update_vehicle.dto';
import { ListingCategory } from '@prisma/client';
import { QueryVehicleDto } from './dto/query_vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateVehicleDto, userId: string) {
    return this.prisma.listing.create({
      data: {
        title: `${dto.brand} ${dto.model} ${dto.year}`,
        category: ListingCategory.VEHICLE,
        description: `${dto.brand} ${dto.model}`,
        price: undefined,
        user: {
          connect: {
            id: userId,
          },
        },

        vehicle: {
          create: {
            type: dto.type,
            brand: dto.brand,
            model: dto.model,
            year: dto.year,
            km_driven: dto.km_driven,
            condition: dto.condition,
            bluebook_status: dto.bluebook_status,
            fuel_type: dto.fuel_type,
            ownership_transfer_ready: dto.ownership_transfer_ready ?? false,
          },
        },
      },
      include: {
        vehicle: true,
      },
    });
  }

  async findAll(query: QueryVehicleDto) {
    return this.prisma.listing.findMany({
      where: {
        category: ListingCategory.VEHICLE,

        vehicle: {
          is: {
            ...(query.brand && { brand: query.brand }),
            ...(query.model && { model: query.model }),
            ...(query.type && { type: query.type }),
            ...(query.condition && { condition: query.condition }),
            ...(query.fuelType && { fuel_type: query.fuelType }),

            ...(query.minYear || query.maxYear
              ? {
                  year: {
                    gte: query.minYear,
                    lte: query.maxYear,
                  },
                }
              : {}),

            ...(query.minKm || query.maxKm
              ? {
                  km_driven: {
                    gte: query.minKm,
                    lte: query.maxKm,
                  },
                }
              : {}),
          },
        },
      },
      include: {
        vehicle: true,
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
        vehicle: true,
      },
    });

    if (!listing || listing.category !== ListingCategory.VEHICLE) {
      throw new NotFoundException('Vehicle listing not found');
    }

    return listing;
  }

  async update(id: string, dto: UpdateVehicleDto) {
    await this.findOne(id);

    return this.prisma.listing.update({
      where: { id },
      data: {
        title: dto.brand && dto.model && dto.year
          ? `${dto.brand} ${dto.model} ${dto.year}`
          : undefined,

        vehicle: {
          update: {
            type: dto.type,
            brand: dto.brand,
            model: dto.model,
            year: dto.year,
            km_driven: dto.km_driven,
            condition: dto.condition,
            bluebook_status: dto.bluebook_status,
            fuel_type: dto.fuel_type,
            ownership_transfer_ready: dto.ownership_transfer_ready,
          },
        },
      },
      include: {
        vehicle: true,
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