import { SearchListingDto } from "../dto/search_listing.dto";
import { Prisma } from "@prisma/client";

export function buildListingFilter(dto: SearchListingDto): Prisma.ListingWhereInput {
  const vehicle: Prisma.VehicleWhereInput = {};

  if (dto.brand) {
    vehicle.brand = {
      contains: dto.brand,
      mode: "insensitive",
    };
  }

  if (dto.model) {
    vehicle.model = {
      contains: dto.model,
      mode: "insensitive",
    };
  }

  if (dto.type) vehicle.type = dto.type;
  if (dto.condition) vehicle.condition = dto.condition;
  if (dto.bluebookStatus) vehicle.bluebook_status = dto.bluebookStatus;
  if (dto.fuelType) vehicle.fuel_type = dto.fuelType;

  if (dto.minYear || dto.maxYear) {
    vehicle.year = {
      ...(dto.minYear !== undefined && { gte: dto.minYear }),
      ...(dto.maxYear !== undefined && { lte: dto.maxYear }),
    };
  }

  if (dto.minKm || dto.maxKm) {
    vehicle.km_driven = {
      ...(dto.minKm !== undefined && { gte: dto.minKm }),
      ...(dto.maxKm !== undefined && { lte: dto.maxKm }),
    };
  }

  return {
    ...(dto.title && {
      title: {
        contains: dto.title,
        mode: "insensitive",
      },
    }),

    ...(dto.minPrice || dto.maxPrice
      ? {
          price: {
            ...(dto.minPrice !== undefined && { gte: dto.minPrice }),
            ...(dto.maxPrice !== undefined && { lte: dto.maxPrice }),
          },
        }
      : {}),

    ...(Object.keys(vehicle).length > 0 && {
      vehicle,
    }),
  };
}