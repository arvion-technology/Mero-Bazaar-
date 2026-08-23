import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateAgricultureDto } from './dto/create_agriculture.dto';
import { UpdateAgricultureDto } from './dto/update_agriculture.dto';
import { ListingCategory } from '@prisma/client';
import { QueryAgricultureDto } from './dto/query_agriculture.dto';

@Injectable()
export class AgricultureService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAgricultureDto, userId: string) {
    return this.prisma.listing.create({
      data: {
        title: `${dto.listingType} in ${dto.district}`,
        category: ListingCategory.AGRICULTURE,
        description: dto.location,
        price: dto.pricePerUnit,
        images: [],
        user: {
          connect: {
            id: userId,
          },
        },

        agriculture: {
          create: {
            listingType: dto.listingType,
            district: dto.district,
            village: dto.village,
            location: dto.location,
            pricePerUnit: dto.pricePerUnit,
            unit: dto.unit,
            organicCertified: dto.organicCertified,
            organicVerified: dto.organicVerified,
            seasonalAvailability: dto.seasonalAvailability,
            animalType: dto.animalType,
            breed: dto.breed,
            age: dto.age,
            healthVaccineStatus: dto.healthVaccineStatus,
            vetServiceType: dto.vetServiceType,
            experienceYears: dto.experienceYears,
            mobileService: dto.mobileService,
            vaccinationAvailable: dto.vaccinationAvailable,
            serviceRadiusKm: dto.serviceRadiusKm,
            healthCertificate: dto.healthCertificate,
            availabilityDays: dto.availabilityDays,
          },
        },
      },
      include: {
        agriculture: true,
      },
    });
  }

  async findAll(query: QueryAgricultureDto) {
    return this.prisma.listing.findMany({
      where: {
        category: ListingCategory.AGRICULTURE,

        agriculture: {
          is: {
            ...(query.listingType && { listingType: query.listingType }),
            ...(query.unit && { unit: query.unit }),
            ...(query.district && { district: query.district }),
          },
        },
      },
      include: {
        agriculture: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  
  
  async findOne(id: string) {
  const listing = await this.prisma.listing.findUnique({
    where: { id },
    include: {
      agriculture: true,
      user: {
        select: {
          id: true,
          name: true,
          isVerified: true,
          phone: true,
          createdAt: true,
          vendorProfile: {
            select: { businessName: true, rating: true },
          },
        },
      },
      reviews: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!listing || listing.category !== ListingCategory.AGRICULTURE) {
    throw new NotFoundException('Agriculture listing not found');
  }

  const [totalListing, reviewAgg] = await Promise.all([
    this.prisma.listing.count({ where: { userId: listing.userId } }),
    this.prisma.review.aggregate({
      where: { listing: { userId: listing.userId } },
      _avg: { rating: true },
      _count: { rating: true },
    }),
  ]);

  return {
    ...listing,
    sellerTotalListing: totalListing,
    sellerRating: reviewAgg._avg.rating ?? 0,
    sellerReviewCount: reviewAgg._count.rating,
  };
}


  async update(id: string, dto: UpdateAgricultureDto, userId: string) {
    const listing = await this.findOne(id);
    if (listing.userId !== userId) {
      throw new ForbiddenException('You do not own this listing.');
    }

    return this.prisma.listing.update({
      where: { id },
      data: {
        description: dto.location,
        price: dto.pricePerUnit,

        agriculture: {
          update: {
            listingType: dto.listingType,
            district: dto.district,
            village: dto.village,
            location: dto.location,
            pricePerUnit: dto.pricePerUnit,
            unit: dto.unit,
            organicCertified: dto.organicCertified,
            organicVerified: dto.organicVerified,
            seasonalAvailability: dto.seasonalAvailability,
            animalType: dto.animalType,
            breed: dto.breed,
            age: dto.age,
            healthVaccineStatus: dto.healthVaccineStatus,
            vetServiceType: dto.vetServiceType,
            experienceYears: dto.experienceYears,
            mobileService: dto.mobileService,
            vaccinationAvailable: dto.vaccinationAvailable,
            serviceRadiusKm: dto.serviceRadiusKm,
            healthCertificate: dto.healthCertificate,
            availabilityDays: dto.availabilityDays,
          },
        },
      },
      include: {
        agriculture: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    const listing = await this.findOne(id);
    if (listing.userId !== userId) {
      throw new ForbiddenException('You do not own this listing.');
    }

    return this.prisma.listing.delete({
      where: { id },
    });
  }

  
    async addPhotos(id: string, files: Express.Multer.File[], userId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: { agriculture: true },
    });
  
    if (!listing || listing.userId !== userId) {
      throw new ForbiddenException('Unauthorized');
    }
  
    if (!listing.agriculture) {
      throw new NotFoundException('Trades listing not found');
    }
  
    const newPhotoUrls = files.map((file) => `/uploads/agriculture/${file.filename}`);
    const updatedImages = [...listing.images, ...newPhotoUrls];
  
    return this.prisma.listing.update({
      where: { id },
      data: { images: updatedImages },
      include: { agriculture: true },
    });
  }
}