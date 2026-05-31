import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateBeautySlotDto } from './dto/create_beauty_slot.dto';
import { UpdateBeautySlotDto } from './dto/update_beauty_slot.dto';
import { WeekDay } from '@prisma/client';

@Injectable()
export class BeautySlotsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBeautySlotDto) {
    const { beautyId, day, startTime, endTime } = dto;

    const beauty = await this.prisma.hairBeautyAndWellness.findUnique({
      where: { id: beautyId },
    });

    if (!beauty) {
      throw new NotFoundException('Beauty service not found');
    }

    if (startTime >= endTime) {
      throw new BadRequestException('Invalid time range');
    }

    const existing = await this.prisma.beautySlot.findFirst({
      where: {
        beautyId,
        day: day as WeekDay,
        startTime,
        endTime,
      },
    });

    if (existing) {
      throw new BadRequestException('Slot already exists');
    }

    return this.prisma.beautySlot.create({
      data: {
        beautyId,
        day: day as WeekDay,
        startTime,
        endTime,
      },
    });
  }

  async findAll() {
    return this.prisma.beautySlot.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const slot = await this.prisma.beautySlot.findUnique({
      where: { id },
    });

    if (!slot) {
      throw new NotFoundException('Slot not found');
    }

    return slot;
  }

  async update(id: string, dto: UpdateBeautySlotDto) {
    const slot = await this.prisma.beautySlot.findUnique({
      where: { id },
    });

    if (!slot) {
      throw new NotFoundException('Slot not found');
    }

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
    const slot = await this.prisma.beautySlot.findUnique({
      where: { id },
    });

    if (!slot) {
      throw new NotFoundException('Slot not found');
    }

    if (slot.isBooked) {
      throw new BadRequestException('Cannot delete booked slot');
    }

    return this.prisma.beautySlot.delete({
      where: { id },
    });
  }
}