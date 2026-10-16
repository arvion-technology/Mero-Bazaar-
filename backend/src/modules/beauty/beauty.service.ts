import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateHairBeautyAndWellnessDto } from './dto/create_beauty.dto';
import { UpdateHairBeautyAndWellnessDto } from './dto/update_beauty.dto';
import { ListingCategory, ListingStatus } from '@prisma/client';
import { validateAndReencodeImage } from '../../common/uploads/upload.utils';
import { assertVerifiedSeller } from '../../common/authz/seller-access';
import {
  assertValidSlots,
  buildDefaultSlots,
  parseDurationMinutes,
} from './beauty-slots.util';

const SELLER_SELECT = {
  id: true,
  name: true,
  isVerified: true,
  phone: true,
  createdAt: true,
  vendorProfile: {
    select: { businessName: true, rating: true },
  },
} as const;

@Injectable()
export class HairBeautyAndWellnessService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateHairBeautyAndWellnessDto, userId: string) {
    await assertVerifiedSeller(this.prisma, userId);

    if (dto.availability?.length) assertValidSlots(dto.availability);

    const minutes = dto.durationMinutes ?? parseDurationMinutes(dto.duration);
    const slots = dto.availability?.length
      ? dto.availability
      : buildDefaultSlots(minutes);

    // Nested create is atomic: listing, beauty and slots all succeed or all fail.
    return this.prisma.listing.create({
      data: {
        title: dto.serviceTitle,
        category: ListingCategory.BEAUTY,
        description:
          dto.shortDescription ??
          (dto.city
            ? `${dto.serviceType} available in ${dto.city}`
            : `${dto.serviceType} service`),
        price: dto.price,
        location: dto.location,
        latitude: dto.latitude,
        longitude: dto.longitude,
        images: dto.portfolioUrls ?? [],
        user: {
          connect: { id: userId },
        },
        beauty: {
          create: {
            serviceType: dto.serviceType,
            price: dto.price,
            priceStartingFrom: dto.priceStartingFrom,
            homeVisit: dto.homeVisit,
            portfolioUrls: dto.portfolioUrls,
            bridalAvailable: dto.bridalAvailable,
            city: dto.city,
            shortDescription: dto.shortDescription,
            serviceLocationType: dto.serviceLocationType,
            studioLocation: dto.studioLocation,
            duration: dto.duration,
            durationMinutes: minutes ?? undefined,
            whoIsThisFor: dto.whoIsThisFor,
            genderPreference: dto.genderPreference,
            experienceLevel: dto.experienceLevel,
            preparationTime: dto.preparationTime,
            tags: dto.tags ?? [],
            beautySlots: {
              createMany: {
                data: slots,
                skipDuplicates: true,
              },
            },
          },
        },
      },
      include: {
        beauty: { include: { beautySlots: true } },
      },
    });
  }

  // Public list: only live listings (AC03). Seller verification is enforced
  // at creation via assertVerifiedSeller, so it is not re-checked here.
  async findAll() {
    return this.prisma.listing.findMany({
      where: {
        category: ListingCategory.BEAUTY,
        status: ListingStatus.ACTIVE,
      },
      include: {
        beauty: { include: { beautySlots: true } },
        user: { select: SELLER_SELECT },
        reviews: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        beauty: { include: { beautySlots: true } },
        user: { select: SELLER_SELECT },
        reviews: true,
      },
    });

    if (!listing || listing.category !== ListingCategory.BEAUTY) {
      throw new NotFoundException('Hair Beauty & Wellness listing not found');
    }

    return listing;
  }

  async update(
    id: string,
    dto: UpdateHairBeautyAndWellnessDto,
    userId: string,
  ) {
    const existing = await this.findOne(id);
    if (existing.userId !== userId) {
      throw new ForbiddenException('Unauthorized');
    }

    if (dto.availability?.length) assertValidSlots(dto.availability);

    const newMinutes =
      dto.durationMinutes ??
      (dto.duration !== undefined
        ? parseDurationMinutes(dto.duration)
        : undefined);

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.listing.update({
        where: { id },
        data: {
          title: dto.serviceTitle,
          description:
            dto.shortDescription ??
            (dto.city
              ? `${dto.serviceType ?? ''} available in ${dto.city}`
              : undefined),
          price: dto.price,
          location: dto.location,
          latitude: dto.latitude,
          longitude: dto.longitude,
          images: dto.portfolioUrls ?? undefined,
          beauty: {
            update: {
              serviceType: dto.serviceType,
              price: dto.price,
              priceStartingFrom: dto.priceStartingFrom,
              homeVisit: dto.homeVisit,
              portfolioUrls: dto.portfolioUrls,
              bridalAvailable: dto.bridalAvailable,
              city: dto.city,
              shortDescription: dto.shortDescription,
              serviceLocationType: dto.serviceLocationType,
              studioLocation: dto.studioLocation,
              duration: dto.duration,
              durationMinutes: newMinutes ?? undefined,
              whoIsThisFor: dto.whoIsThisFor,
              genderPreference: dto.genderPreference,
              experienceLevel: dto.experienceLevel,
              preparationTime: dto.preparationTime,
              tags: dto.tags,
            },
          },
        },
        include: { beauty: true },
      });

      const beautyId = updated.beauty?.id;
      if (beautyId) {
        const durationChanged =
          newMinutes != null &&
          newMinutes !== existing.beauty?.durationMinutes;
        const availabilityProvided = !!dto.availability?.length;
        const slotCount = await tx.beautySlot.count({ where: { beautyId } });

        if (durationChanged || availabilityProvided || slotCount === 0) {
          // Keep slots that already have appointments (FK is Restrict).
          await tx.beautySlot.deleteMany({
            where: { beautyId, beautyappointments: { none: {} } },
          });

          const minutes =
            updated.beauty?.durationMinutes ??
            parseDurationMinutes(updated.beauty?.duration);

          const slots = availabilityProvided
            ? dto.availability!
            : buildDefaultSlots(minutes);

          await tx.beautySlot.createMany({
            data: slots.map((s) => ({ ...s, beautyId })),
            skipDuplicates: true,
          });
        }
      }

      return tx.listing.findUnique({
        where: { id },
        include: { beauty: { include: { beautySlots: true } } },
      });
    });
  }

  async remove(id: string, userId: string) {
    const existing = await this.findOne(id);
    if (existing.userId !== userId) {
      throw new ForbiddenException('Unauthorized');
    }

    return this.prisma.listing.delete({ where: { id } });
  }

  async addPhotos(id: string, files: Express.Multer.File[], userId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: { beauty: true },
    });

    if (!listing || listing.userId !== userId) {
      throw new ForbiddenException('Unauthorized');
    }

    if (!listing.beauty) {
      throw new NotFoundException('Beauty listing not found');
    }

    const newPhotoNames: string[] = [];
    for (const file of files) {
      const finalName = await validateAndReencodeImage(
        file.path,
        './uploads/beauty',
      );
      newPhotoNames.push(finalName);
    }

    const newPhotoUrls = newPhotoNames.map((name) => `/uploads/beauty/${name}`);
    const updatedImages = [...listing.images, ...newPhotoUrls];

    return this.prisma.listing.update({
      where: { id },
      data: {
        images: updatedImages,
        beauty: {
          update: {
            portfolioUrls: updatedImages,
          },
        },
      },
      include: {
        beauty: true,
      },
    });
  }
}