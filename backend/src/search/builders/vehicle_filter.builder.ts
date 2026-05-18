import { Prisma } from "@prisma/client";
import { VehicleSearchDto } from "../dto/vehicle_search.dto";

export function buildVehicleFilter(dto: VehicleSearchDto): Prisma.ListingWhereInput {
  const query = dto.query?.trim();

  return {
    vehicle: {
      is: {
        ...(dto.brand && {
          brand: {
            contains: dto.brand,
            mode: "insensitive",
          },
        }),

        ...(dto.model && {
          model: {
            contains: dto.model,
            mode: "insensitive",
          },
        }),

        ...(dto.type && {
          type: dto.type,
        }),

        ...(dto.condition && {
          condition: dto.condition,
        }),

        ...(dto.fuelType && {
          fuelType: dto.fuelType,
        }),

        ...(dto.bluebookStatus && {
          bluebook_status: dto.bluebookStatus,
        }),

        ...((dto.minYear !== undefined || dto.maxYear !== undefined) && {
          year: {
            ...(dto.minYear !== undefined && { gte: dto.minYear }),
            ...(dto.maxYear !== undefined && { lte: dto.maxYear }),
          },
        }),

        ...((dto.minKm !== undefined || dto.maxKm !== undefined) && {
          km_driven: {
            ...(dto.minKm !== undefined && { gte: dto.minKm }),
            ...(dto.maxKm !== undefined && { lte: dto.maxKm }),
          },
        }),

        ...(query && {
          OR: [
            { brand: { contains: query, mode: "insensitive" } },
            { model: { contains: query, mode: "insensitive" } },
          ],
        }),
      },
    },
  };
}