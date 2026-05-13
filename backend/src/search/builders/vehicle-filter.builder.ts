import { Prisma } from '@prisma/client';
import { VehicleSearchDto } from 'src/search/dto/vehicle_search.dto';

export function buildVehicleFilter(dto: VehicleSearchDto): Prisma.VehicleWhereInput {
  const where: Prisma.VehicleWhereInput = {};

  if (dto.brand) {
    where.brand = {
      contains: dto.brand,
      mode: 'insensitive',
    };
  }

  if (dto.model) {
    where.model = {
      contains: dto.model,
      mode: 'insensitive',
    };
  }

  if (dto.type) where.type = dto.type;
  if (dto.condition) where.condition = dto.condition;
  if (dto.bluebookStatus) where.bluebook_status = dto.bluebookStatus;
  if (dto.fuelType) where.fuel_type = dto.fuelType;

  if (dto.minYear !== undefined || dto.maxYear !== undefined) {
    where.year = {
      ...(dto.minYear !== undefined && { gte: dto.minYear }),
      ...(dto.maxYear !== undefined && { lte: dto.maxYear }),
    };
  }

  if (dto.minKm !== undefined || dto.maxKm !== undefined) {
    where.km_driven = {
      ...(dto.minKm !== undefined && { gte: dto.minKm }),
      ...(dto.maxKm !== undefined && { lte: dto.maxKm }),
    };
  }

  return where;
}