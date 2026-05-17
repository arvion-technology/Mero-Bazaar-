import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateVehicleDto } from './dto/create_vehicle.dto';
import { ListingCategory } from '@prisma/client';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateVehicleDto) {
    return this.prisma.listing.create({
      data: {
        category: ListingCategory.VEHICLE,
        title: `${dto.brand} ${dto.model} ${dto.year}`,

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
            ownership_transfer_ready:
              dto.ownership_transfer_ready ?? false,
          },
        },
      },
      include: {
        vehicle: true,
      },
    });
  }

  async findByListingId(listingId: string) {
    return this.prisma.listing.findFirst({
      where: {
        id: listingId,
        category: ListingCategory.VEHICLE,
      },
      include: {
        vehicle: true,
      },
    });
  }
}