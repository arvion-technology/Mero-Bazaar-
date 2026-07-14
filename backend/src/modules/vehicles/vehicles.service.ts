import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateVehicleDto } from './dto/create_vehicle.dto';
import { UpdateVehicleDto } from './dto/update_vehicle.dto';
import { ListingCategory } from '@prisma/client';
import { QueryVehicleDto } from './dto/query_vehicle.dto';
import { sanitizeVehicleDetails } from 'src/common/utils/vehicle_details.util';
import sharp from 'sharp';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateVehicleDto, userId: string) {
    const cleanDetails = sanitizeVehicleDetails(
      dto.type,
      dto.details ?? {},
    );

    return this.prisma.listing.create({
      data: {
        title: `${dto.brand} ${dto.model} ${dto.year}`,
        category: ListingCategory.VEHICLE,
        description: dto.description ?? `${dto.brand} ${dto.model}`,
        price: dto.price,
        images: dto.images ?? [],
        latitude: dto.latitude,
        longitude: dto.longitude,
        user: {
          connect: {
            id: userId,
          },
        },

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
            ownership_transfer_ready: dto.ownership_transfer_ready ?? false,
            details: cleanDetails,
          },
        },
      },
      include: {
        vehicle: true,
      },
    });
  }

async findAll(query: QueryVehicleDto) {
  const listings = await this.prisma.listing.findMany({
    where: {
      category: ListingCategory.VEHICLE,

      vehicle: {
        is: {
          ...(query.brand && { brand: query.brand }),
          ...(query.model && { model: query.model }),
          ...(query.type && { type: query.type }),
          ...(query.condition && { condition: query.condition }),
          ...(query.fuelType && { fuel_type: query.fuelType }),

          ...(query.minYear || query.maxYear
            ? {
                year: {
                  ...(query.minYear && { gte: query.minYear }),
                  ...(query.maxYear && { lte: query.maxYear }),
                },
              }
            : {}),

          ...(query.minKm || query.maxKm
            ? {
                km_driven: {
                  ...(query.minKm && { gte: query.minKm }),
                  ...(query.maxKm && { lte: query.maxKm }),
                },
              }
            : {}),
        },
      },
    },
    include: {
      vehicle: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const filters = {
    brands: [...new Set(listings.map(l => l.vehicle?.brand).filter(Boolean))],
    conditions: [...new Set(listings.map(l => l.vehicle?.condition).filter(Boolean))],
    fuelTypes: [...new Set(listings.map(l => l.vehicle?.fuel_type).filter(Boolean))],
    categories: [...new Set(listings.map(l => l.vehicle?.type).filter(Boolean))],
  };

  return {
    data: listings,
    filters,
  };
}
  async findOne(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        vehicle: true,
      },
    });

    if (!listing || listing.category !== ListingCategory.VEHICLE) {
      throw new NotFoundException('Vehicle listing not found');
    }

    return listing;
  }

  async update(id: string, dto: UpdateVehicleDto, userId: string) {    
    const existing = await this.findOne(id);

    if (existing.userId !== userId) {                  
      throw new ForbiddenException('You do not own this listing');
    }

    const vehicleType = dto.type ?? existing.vehicle?.type;
    const cleanDetails =
      dto.details && vehicleType
        ? sanitizeVehicleDetails(vehicleType, dto.details)
        : undefined;

    return this.prisma.listing.update({
      where: { id },             
      data: {
        title: dto.brand && dto.model && dto.year
          ? `${dto.brand} ${dto.model} ${dto.year}`
          : undefined,
        latitude: dto.latitude,
        longitude: dto.longitude,
        images: dto.images,                                

        vehicle: {
          update: {
            type: dto.type,
            brand: dto.brand,
            model: dto.model,
            year: dto.year,
            km_driven: dto.km_driven,
            condition: dto.condition,
            bluebook_status: dto.bluebook_status,
            fuel_type: dto.fuel_type,
            ownership_transfer_ready: dto.ownership_transfer_ready,
            ...(cleanDetails && { details: cleanDetails }),
          },
        },
      },
      include: { vehicle: true },
    });
  }

  async remove(id: string, userId: string) {
    const existing = await this.findOne(id);
    if (existing.userId !== userId) {
      throw new ForbiddenException('You do not own this listing');
    }
    return this.prisma.listing.delete({ where: { id } });
  }

  async savePhotos(id: string, files: Express.Multer.File[], userId: string) {
    const existing = await this.findOne(id);
    if (existing.userId !== userId) {
      throw new ForbiddenException('You do not own this listing');
    }

    const savedPaths: string[] = [];

    for (const file of files) {
      const processedFilename = `processed-${file.filename}`;
      const processedPath = path.join('./uploads/vehicles', processedFilename);

      await sharp(file.path)
        .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toFile(processedPath);

      await this.safeUnlink(file.path);
      savedPaths.push(`/uploads/vehicles/${processedFilename}`);
    }

    return this.prisma.listing.update({
      where: { id },
      data: { images: savedPaths },
      include: { vehicle: true },
    });
  }

  private async safeUnlink(filePath: string, retries = 3, delayMs = 150) {
    for (let i = 0; i < retries; i++) {
      try {
        await fs.unlink(filePath);
        return;
      } catch (err) {
        if (i === retries - 1) {
          console.error(`Failed to unlink ${filePath}:`, err);
          return;
        }
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  }
}