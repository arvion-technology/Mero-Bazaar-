import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

  async create(dto: CreateBeautySlotDto) {
    const beauty = await this.resolveBeautyByListingId(dto.beautyId);

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

  async update(id: string, dto: UpdateBeautySlotDto) {
    const slot = await this.findOne(id);

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

  async remove(id: string) {
    const slot = await this.findOne(id);

    if (slot.isBooked) {
      throw new BadRequestException('Cannot delete a booked slot');
    }

    return this.prisma.beautySlot.delete({ where: { id } });
  }
}