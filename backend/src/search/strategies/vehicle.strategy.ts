import { Injectable } from "@nestjs/common";
import { PrismaService } from 'src/database/prisma.service';
import { SearchStrategy } from "./search.strategy.interface";
import { VehicleSearchDto } from "../dto/vehicle_search.dto";

@Injectable()
export class VehicleStrategy implements SearchStrategy {
  constructor(private prisma: PrismaService) {}

    async search(filters: VehicleSearchDto) {
      return this.prisma.vehicle.findMany({
        where: {
          type: filters.type,
          brand: filters.brand,
          model: filters.model,
          condition: filters.condition,
          fuel_type: filters.fuelType,

          year: {
            gte: filters.minYear,
            lte: filters.maxYear,
          },

          km_driven: {
            gte: filters.minKm,
            lte: filters.maxKm,
          },

        },
        include: {
          listing: true,
        }
      });
    }
  }
