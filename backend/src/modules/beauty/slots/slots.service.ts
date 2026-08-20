import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateBeautySlotDto } from './dto/create_beauty_slot.dto';
import { UpdateBeautySlotDto } from './dto/update_beauty_slot.dto';
import { WeekDay } from '@prisma/client';

@Injectable()
export class BeautySlotsService {
  constructor(private prisma: PrismaService) {}

  private toMinutes(time: string) {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }

  async resolveBeautyByListingId(listingId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      include: { beauty: true },
    });

    if (!listing?.beauty) {
      throw new NotFoundException('Beauty service not found');
    }

    return listing.beauty;
  }

  // dto.beautyId is actually a listingId (see resolveBeautyByListingId). Kept as-is to avoid a DTO rename.
  private async resolveListingWithBeauty(listingId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      include: { beauty: true },
    });

    if (!listing?.beauty) {
      throw new NotFoundException('Beauty service not found');
    }

    return listing;
  }

  private assertOwnerOrAdmin(listingUserId: string, userId: string, role: string) {
    if (role !== 'ADMIN' && listingUserId !== userId) {
      throw new ForbiddenException('You do not own this beauty listing');
    }
  }

  async create(dto: CreateBeautySlotDto, userId: string, role: string) {
    const listing = await this.resolveListingWithBeauty(dto.beautyId);
    this.assertOwnerOrAdmin(listing.userId, userId, role);
    const beauty = listing.beauty!;

    if (this.toMinutes(dto.startTime) >= this.toMinutes(dto.endTime)) {
      throw new BadRequestException('startTime must be before endTime');
    }

    const existing = await this.prisma.beautySlot.findFirst({
      where: {
        beautyId: beauty.id,
        day: dto.day as WeekDay,
        startTime: dto.startTime,
        endTime: dto.endTime,
      },
    });

    if (existing) {
      throw new BadRequestException('Slot already exists for this day and time');
    }

    return this.prisma.beautySlot.create({
      data: {
        beautyId: beauty.id,
        day: dto.day as WeekDay,
        startTime: dto.startTime,
        endTime: dto.endTime,
      },
    });
  }

  async findAll() {
    return this.prisma.beautySlot.findMany({
      orderBy: { day: 'asc' },
      select: {
        id: true,
        day: true,
        startTime: true,
        endTime: true,
        isBooked: true,
        beauty: {
          select: {
            id: true,
            serviceType: true,
            price: true,
            city: true,
            listingId: true,
            listing: {
              select: {
                title: true,
                images: true,
              },
            },
          },
        },
      },
    });
  }

  async findByListing(listingId: string) {
    const beauty = await this.resolveBeautyByListingId(listingId);

    return this.prisma.beautySlot.findMany({
      where: { beautyId: beauty.id },
      orderBy: { day: 'asc' },
      select: {
        id: true,
        day: true,
        startTime: true,
        endTime: true,
        isBooked: true,
        beauty: {
          select: {
            id: true,
            serviceType: true,
            price: true,
            city: true,
            listingId: true,
            listing: {
              select: {
                title: true,
                images: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const slot = await this.prisma.beautySlot.findUnique({ where: { id } });

    if (!slot) throw new NotFoundException('Slot not found');

    return slot;
  }

  private async findOneWithOwner(id: string) {
    const slot = await this.prisma.beautySlot.findUnique({
      where: { id },
      include: { beauty: { include: { listing: true } } },
    });

    if (!slot) throw new NotFoundException('Slot not found');
    return slot;
  }

  async update(id: string, dto: UpdateBeautySlotDto, userId: string, role: string) {
    const slot = await this.findOneWithOwner(id);
    this.assertOwnerOrAdmin(slot.beauty.listing.userId, userId, role);

    if (slot.isBooked) {
      throw new BadRequestException('Cannot update a booked slot');
    }

    return this.prisma.beautySlot.update({
      where: { id },
      data: {
        day: dto.day,
        startTime: dto.startTime,
        endTime: dto.endTime,
      },
    });
  }

  async remove(id: string, userId: string, role: string) {
    const slot = await this.findOneWithOwner(id);
    this.assertOwnerOrAdmin(slot.beauty.listing.userId, userId, role);

    if (slot.isBooked) {
      throw new BadRequestException('Cannot delete a booked slot');
    }

    return this.prisma.beautySlot.delete({ where: { id } });
  }
}