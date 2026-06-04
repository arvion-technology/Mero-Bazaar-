import { Injectable } from '@nestjs/common';
import { ListingCategory } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

import { CreateTradesDto } from './dto/create_trades.dto';
import { QueryTradesDto } from './dto/query_trades.dto';
import { CreateLeadDto } from './dto/lead.dto';
import { UpdateTradesDto } from './dto/update_trades.dto';

@Injectable()
export class TradesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTradesDto) {
    return this.prisma.listing.create({
      data: {
        category: ListingCategory.TRADES,
        title: dto.title,
        description: dto.description,
        latitude: dto.latitude,
        longitude: dto.longitude,
        images: [],
        trades: {
          create: {
            city: dto.city,
            ward: dto.ward,
            skillTags: dto.skillTags,
            serviceAreaKm: dto.serviceAreaKm,
            calloutCharge: dto.calloutCharge,
            emergencyAvailable: dto.emergencyAvailable,
            warrantyGiven: dto.warrantyGiven,
          },
        },
      },
      include: {
        trades: true,
      },
    });
  }

  async findAll(query: QueryTradesDto) {
    return this.prisma.listing.findMany({
      where: {
        category: ListingCategory.TRADES,
        trades: {
          city: query.city,
          emergencyAvailable: query.emergency,
          skillTags: query.skill ? { has: query.skill } : undefined,
        },
      },
      include: {
        trades: true,
      },
    });
  }

  async emergency(city?: string) {
    return this.prisma.listing.findMany({
      where: {
        category: ListingCategory.TRADES,
        trades: {
          emergencyAvailable: true,
          city,
        },
      },
      include: {
        trades: true,
      },
    });
  }

  async createLead(listingId: string, dto: CreateLeadDto) {
    return this.prisma.lead.create({
      data: {
        listingId,
        leadType: dto.leadType,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.listing.findUnique({
      where: { id },
      include: {
        trades: true,
      },
    });
  }

  async nearby(lat: number, lng: number, km: number) {
    return this.geoSearchNearby(lat, lng, km);
  }

  private async geoSearchNearby(lat: number, lng: number, km: number) {
    const range = km / 111;

    return this.prisma.listing.findMany({
      where: {
        category: ListingCategory.TRADES,
        latitude: {
          gte: lat - range,
          lte: lat + range,
        },
        longitude: {
          gte: lng - range,
          lte: lng + range,
        },
      },
      include: {
        trades: true,
      },
    });
  }

  async update(id: string, dto: UpdateTradesDto) {
    return this.prisma.listing.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        trades: {
          update: {
            city: dto.city,
            skillTags: dto.skillTags,
            serviceAreaKm: dto.serviceAreaKm,
            calloutCharge: dto.calloutCharge,
            emergencyAvailable: dto.emergencyAvailable,
            warrantyGiven: dto.warrantyGiven,
            avgResponseHours: dto.avgResponseHours,
          },
        },
      },
      include: {
        trades: true,
      },
    });
  }
  async remove(id: string) {
    return this.prisma.listing.delete({
      where: { id },
    });
  }
  }
