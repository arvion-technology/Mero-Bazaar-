<<<<<<< HEAD
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

import { buildListingFilter } from './builders/listings_filter.builder';
import { buildVehicleFilter } from './builders/vehicle_filter.builder';
import { buildJobFilter } from './builders/job_filter.builder';
import { buildRentalFilter } from './builders/rental_filter.builder';
import { buildMedicalFilter } from './builders/medical_filter.builder.dto';
import { buildTradesFilter } from './builders/trades_filter.build';
import { buildAgricultureFilter } from './builders/agriculture_filter.builder';
import { buildSecondHandFilter } from './builders/secondhand_filter.builders';
import { buildFoodsFilter } from './builders/foods_filter.builder';
import { buildBeautyFilter } from './builders/beauty_filter.builders.dto';

import { ListingSearchDto } from './dto/listing_search.dto';
import { VehicleSearchDto } from './dto/vehicle_search.dto';
import { JobSearchDto } from './dto/job_search.dto';
import { RentalSearchDto } from './dto/rental_search.dto';
import { MedicalSearchDto } from './dto/medical_search.dto';
import { TradesSearchDto } from './dto/trade_search.dto';
import { AgricultureSearchDto } from './dto/agriculture_search.dto';
import { SecondHandSearchDto } from './dto/secondhand_search.dto';
import { SearchFoodsDto } from './dto/foods_search.dto';
import { BeautySearchDto } from './dto/beauty_search.dto';

const MAX_PAGE_SIZE = 50;
const DEFAULT_PAGE_SIZE = 20;

/**
 * Bounded pagination: every public search query is capped so anonymous callers
 * cannot request unbounded result sets (resource exhaustion / bulk scraping).
 */
function paginate(filters: unknown, defaultSize = DEFAULT_PAGE_SIZE) {
  const f = (filters ?? {}) as { page?: number; limit?: number };
  const take = Math.min(
    Math.max(1, Math.floor(f.limit ?? defaultSize)),
    MAX_PAGE_SIZE,
  );
  const page = Math.max(1, Math.floor(f.page ?? 1));
  return { take, skip: (page - 1) * take };
}
=======
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";

import { buildListingFilter } from "./builders/listings_filter.builder";
import { buildVehicleFilter } from "./builders/vehicle_filter.builder";
import { buildJobFilter } from "./builders/job_filter.builder";
import { buildRentalFilter } from "./builders/rental_filter.builder";
import { buildMedicalFilter } from "./builders/medical_filter.builder.dto";
import { buildTradesFilter } from "./builders/trades_filter.build";
import { buildAgricultureFilter } from "./builders/agriculture_filter.builder";
import { buildSecondHandFilter } from "./builders/secondhand_filter.builders";
import { buildFoodsFilter } from "./builders/foods_filter.builder";
import { buildBeautyFilter } from "./builders/beauty_filter.builders.dto";

import { ListingSearchDto } from "./dto/listing_search.dto";
import { VehicleSearchDto } from "./dto/vehicle_search.dto";
import { JobSearchDto } from "./dto/job_search.dto";
import { RentalSearchDto } from "./dto/rental_search.dto";
import { MedicalSearchDto } from "./dto/medical_search.dto";
import { TradesSearchDto } from "./dto/trade_search.dto";
import { AgricultureSearchDto } from "./dto/agriculture_search.dto";
import { SecondHandSearchDto } from "./dto/secondhand_search.dto";
import { SearchFoodsDto } from "./dto/foods_search.dto";
import { BeautySearchDto } from "./dto/beauty_search.dto";
>>>>>>> origin/aashika

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(filters: ListingSearchDto) {
    const where = buildListingFilter(filters);
<<<<<<< HEAD
    const { take, skip } = paginate(filters);

    return this.prisma.listing.findMany({
      where,
      take,
      skip,
=======

    return this.prisma.listing.findMany({
      where,
>>>>>>> origin/aashika
      include: {
        vehicle: true,
        job: true,
        medical: true,
<<<<<<< HEAD
        trades: true,
        rental: true,
        agriculture: true,
        secondhand: true,
        foods: true,
        beauty: true,
      },
      orderBy: {
        createdAt: 'desc',
=======
        trades: true, 
        rental: true,        
        agriculture: true,   
        secondhand: true,   
        foods: true,         
        beauty: true,
      },
      orderBy: {
        createdAt: "desc",
>>>>>>> origin/aashika
      },
    });
  }

  async vehicleSearch(filters: VehicleSearchDto) {
    const where = buildVehicleFilter(filters);
<<<<<<< HEAD
    const { take, skip } = paginate(filters);

    return this.prisma.listing.findMany({
      where,
      take,
      skip,
=======

    return this.prisma.listing.findMany({
      where,
>>>>>>> origin/aashika
      include: {
        vehicle: true,
      },
      orderBy: {
<<<<<<< HEAD
        createdAt: 'desc',
=======
        createdAt: "desc",
>>>>>>> origin/aashika
      },
    });
  }

  async jobSearch(filters: JobSearchDto) {
    const where = buildJobFilter(filters);
<<<<<<< HEAD
    const { take, skip } = paginate(filters, 20);

    return this.prisma.listing.findMany({
      where,
      take,
      skip,
      include: {
        job: true,
        //user: { include: { vendorProfile: true } }, user card not implemented yet
      },
      orderBy: { createdAt: filters.sort === 'oldest' ? 'asc' : 'desc' },
=======

    return this.prisma.listing.findMany({
      where,
      include: {
        job: true,
      //user: { include: { vendorProfile: true } }, user card not implemented yet
      },
      orderBy: { createdAt: filters.sort === 'oldest' ? 'asc' : 'desc' },
      take: filters.limit ?? 20,  
      skip: ((filters.page ?? 1) - 1) * (filters.limit ?? 20),
>>>>>>> origin/aashika
    });
  }
  async rentalSearch(filters: RentalSearchDto) {
    const where = buildRentalFilter(filters);
<<<<<<< HEAD
    const { take, skip } = paginate(filters);

    return this.prisma.listing.findMany({
      where,
      take,
      skip,
=======

    return this.prisma.listing.findMany({
      where,
>>>>>>> origin/aashika
      include: {
        rental: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  async medicalSearch(filters: MedicalSearchDto) {
    const where = buildMedicalFilter(filters);
<<<<<<< HEAD
    const { take, skip } = paginate(filters);

    return this.prisma.listing.findMany({
      where,
      take,
      skip,
=======

    return this.prisma.listing.findMany({
      where,
>>>>>>> origin/aashika
      include: {
        medical: true,
      },
      orderBy: {
<<<<<<< HEAD
        createdAt: 'desc',
=======
        createdAt: "desc",
>>>>>>> origin/aashika
      },
    });
  }

  async tradesSearch(filters: TradesSearchDto) {
    const where = buildTradesFilter(filters);
<<<<<<< HEAD
    const { take, skip } = paginate(filters);

    return this.prisma.listing.findMany({
      where,
      take,
      skip,
=======

    return this.prisma.listing.findMany({
      where,
>>>>>>> origin/aashika
      include: {
        trades: true,
      },
      orderBy: {
<<<<<<< HEAD
        createdAt: 'desc',
=======
        createdAt: "desc",
>>>>>>> origin/aashika
      },
    });
  }
  async agricultureSearch(filters: AgricultureSearchDto) {
    const where = buildAgricultureFilter(filters);
<<<<<<< HEAD
    const { take, skip } = paginate(filters);

    return this.prisma.listing.findMany({
      where,
      take,
      skip,
=======

    return this.prisma.listing.findMany({
      where,
>>>>>>> origin/aashika
      include: {
        agriculture: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

<<<<<<< HEAD
  async secondhandSearch(filters: SecondHandSearchDto) {
    const where = buildSecondHandFilter(filters);
    const { take, skip } = paginate(filters);

    return this.prisma.listing.findMany({
      where,
      take,
      skip,
=======
   async secondhandSearch(filters: SecondHandSearchDto) {
    const where = buildSecondHandFilter(filters);

    return this.prisma.listing.findMany({
      where,
>>>>>>> origin/aashika
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
<<<<<<< HEAD
    const { take, skip } = paginate(filters);

    return this.prisma.listing.findMany({
      where,
      take,
      skip,
=======

    return this.prisma.listing.findMany({
      where,
>>>>>>> origin/aashika
      include: {
        foods: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  async beautySearch(filters: BeautySearchDto) {
    const where = buildBeautyFilter(filters);
<<<<<<< HEAD
    const { take, skip } = paginate(filters);

    return this.prisma.listing.findMany({
      where,
      take,
      skip,
=======

    return this.prisma.listing.findMany({
      where,
>>>>>>> origin/aashika
      include: {
        beauty: true,
      },
      orderBy: {
        createdAt: 'desc',
<<<<<<< HEAD
      },
    });
  }
}
=======
      }
    })
  }
}
>>>>>>> origin/aashika
