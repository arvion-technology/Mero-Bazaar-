import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateVehicleDto } from './dto/vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  create(listingId: string, dto: CreateVehicleDto) {
    return this.prisma.vehicle.create({
      data: {
        listingId,
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
    });
  }

  findByListingId(listingId: string) {
    return this.prisma.vehicle.findUnique({
      where: { listingId },
    });
  }
}