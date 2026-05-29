import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";

import { buildListingFilter } from "./builders/listings_filter.builder";
import { buildVehicleFilter } from "./builders/vehicle_filter.builder";
import { buildJobFilter } from "./builders/job_filter.builder";
import { buildMedicalFilter } from "./builders/medical_filter.builder.dto";
import { buildTradesFilter } from "./builders/trades_filter.build";
import { buildAgricultureFilter } from "./builders/agriculture_filter.builder";
import { buildSecondHandFilter } from "./builders/secondhand_filter.builders";
import { buildFoodsFilter } from "./builders/foods_filter.builder";

import { ListingSearchDto } from "./dto/listing_search.dto";
import { VehicleSearchDto } from "./dto/vehicle_search.dto";
import { JobSearchDto } from "./dto/job_search.dto";
import { MedicalSearchDto } from "./dto/medical_search.dto";
import { TradesSearchDto } from "./dto/trade_search.dto";
import { AgricultureSearchDto } from "./dto/agriculture_search.dto";
import { SecondHandSearchDto } from "./dto/secondhand_search.dto";
import { SearchFoodsDto } from "./dto/foods_search.dto";

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
        trades: true, 
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

  async tradesSearch(filters: TradesSearchDto) {
    const where = buildTradesFilter(filters);

    return this.prisma.listing.findMany({
      where,
      include: {
        trades: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
  async agricultureSearch(filters: AgricultureSearchDto) {
    const where = buildAgricultureFilter(filters);

    return this.prisma.listing.findMany({
      where,
      include: {
        agriculture: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

   async secondhandSearch(filters: SecondHandSearchDto) {
    const where = buildSecondHandFilter(filters);

    return this.prisma.listing.findMany({
      where,
      include: {
        secondhand: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  async foodsSearch(filters: SearchFoodsDto) {
    const where = buildFoodsFilter(filters);

    return this.prisma.listing.findMany({
      where,
      include: {
        foods: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}