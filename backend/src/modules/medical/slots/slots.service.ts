import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { WeekDay } from '@prisma/client';
import { UpdateMedicalSlotDto } from './dto/update_medical_slots.dto';
import { CreateMedicalSlotDto } from './dto/create_medical_slots.dto';

@Injectable()
export class MedicalSlotsService {
  constructor(private prisma: PrismaService) {}

  private toMinutes(time: string) {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }

  async resolveMedicalByListingId(listingId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      include: { medical: true },
    });

    if (!listing?.medical) {
      throw new NotFoundException('Medical service not found');
    }

    return listing.medical;
  }

  async create(dto: CreateMedicalSlotDto) {
    const medical = await this.resolveMedicalByListingId(dto.medicalId);

    if (this.toMinutes(dto.startTime) >= this.toMinutes(dto.endTime)) {
      throw new BadRequestException('startTime must be before endTime');
    }

    const existing = await this.prisma.medicalSlot.findFirst({
      where: {
        medicalId: medical.id,
        day: dto.day as WeekDay,
        startTime: dto.startTime,
        endTime: dto.endTime,
      },
    });

    if (existing) {
      throw new BadRequestException('Slot already exists for this day and time');
    }

    return this.prisma.medicalSlot.create({
      data: {
        medicalId: medical.id,
        day: dto.day as WeekDay,
        startTime: dto.startTime,
        endTime: dto.endTime,
      },
    });
  }

  async findAll() {
    return this.prisma.medicalSlot.findMany({
      orderBy: { day: 'asc' },
      select: {
        id: true,
        day: true,
        startTime: true,
        endTime: true,
        isBooked: true,
        medical: {
          select: {
            id: true,
            serviceType: true,
            appointmentFee: true,
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
    const medical = await this.resolveMedicalByListingId(listingId);

    return this.prisma.medicalSlot.findMany({
      where: { medicalId: medical.id },
      orderBy: { day: 'asc' },
      select: {
        id: true,
        day: true,
        startTime: true,
        endTime: true,
        isBooked: true,
        medical: {
          select: {
            id: true,
            serviceType: true,
            appointmentFee: true,
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
    const slot = await this.prisma.medicalSlot.findUnique({ where: { id } });

    if (!slot) throw new NotFoundException('Slot not found');

    return slot;
  }

  async update(id: string, dto: UpdateMedicalSlotDto) {
    const slot = await this.findOne(id);

    if (slot.isBooked) {
      throw new BadRequestException('Cannot update a booked slot');
    }

    return this.prisma.medicalSlot.update({
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

    return this.prisma.medicalSlot.delete({ where: { id } });
  }
}