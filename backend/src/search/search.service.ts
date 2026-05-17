import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";

import { buildListingFilter } from "./builders/listings_filter.builder";
import { buildVehicleFilter } from "./builders/vehicle_filter.builder";
import { buildJobFilter } from "./builders/job_filter.builder";
import { buildMedicalFilter } from "./builders/medical_filter.builder.dto";

import { ListingSearchDto } from "./dto/listing_search.dto";
import { VehicleSearchDto } from "./dto/vehicle_search.dto";
import { JobSearchDto } from "./dto/job_search.dto";
import { MedicalSearchDto } from "./dto/medical_search.dto";

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(filters: ListingSearchDto) {
    const where = buildListingFilter(filters);

    return this.prisma.listing.findMany({
      where,
      include: {
        vehicle: true,
        job: true,
        medical: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async vehicleSearch(filters: VehicleSearchDto) {
    const where = buildVehicleFilter(filters);

    return this.prisma.listing.findMany({
      where,
      include: {
        vehicle: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async jobSearch(filters: JobSearchDto) {
    const where = buildJobFilter(filters);

    return this.prisma.listing.findMany({
      where,
      include: {
        job: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async medicalSearch(filters: MedicalSearchDto) {
    const where = buildMedicalFilter(filters);

    return this.prisma.listing.findMany({
      where,
      include: {
        medical: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}