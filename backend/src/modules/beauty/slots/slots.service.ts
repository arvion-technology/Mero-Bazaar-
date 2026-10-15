import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateBeautySlotDto } from './dto/create_beauty_slot.dto';
import { UpdateBeautySlotDto } from './dto/update_beauty_slot.dto';
import { AppointmentStatus, Prisma, WeekDay } from '@prisma/client';

// Appointments in these states occupy a slot on their date.
const ACTIVE_STATUSES: AppointmentStatus[] = [
  AppointmentStatus.PENDING,
  AppointmentStatus.CONFIRMED,
];

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

  private assertOwnerOrAdmin(
    listingUserId: string,
    userId: string,
    role: string,
  ) {
    if (role !== 'ADMIN' && listingUserId !== userId) {
      throw new ForbiddenException('You do not own this beauty listing');
    }
  }

  private async assertNoActiveBookings(slotId: string, action: string) {
    const active = await this.prisma.beautyAppointment.count({
      where: { slotId, status: { in: ACTIVE_STATUSES } },
    });

    if (active > 0) {
      throw new BadRequestException(
        `Cannot ${action} a slot that has active bookings`,
      );
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
      throw new BadRequestException(
        'Slot already exists for this day and time',
      );
    }

    try {
      return await this.prisma.beautySlot.create({
        data: {
          beautyId: beauty.id,
          day: dto.day as WeekDay,
          startTime: dto.startTime,
          endTime: dto.endTime,
        },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new BadRequestException(
          'Slot already exists for this day and time',
        );
      }
      throw e;
    }
  }

  async findAll() {
    return this.prisma.beautySlot.findMany({
      orderBy: { day: 'asc' },
      select: {
        id: true,
        day: true,
        startTime: true,
        endTime: true,
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

  /**
   * Slots for a listing. Pass `date` (YYYY-MM-DD) to get per-date
   * availability: `isBooked` is true if an active appointment already
   * holds that slot on that date. Without `date`, isBooked is false.
   */
  async findByListing(listingId: string, date?: string) {
    const beauty = await this.resolveBeautyByListingId(listingId);

    let dateFilter: Date | undefined;
    if (date) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        throw new BadRequestException('date must be YYYY-MM-DD');
      }
      dateFilter = new Date(`${date}T00:00:00.000Z`);
      if (isNaN(dateFilter.getTime())) {
        throw new BadRequestException('Invalid date');
      }
    }

    const slots = await this.prisma.beautySlot.findMany({
      where: { beautyId: beauty.id },
      orderBy: [{ day: 'asc' }, { startTime: 'asc' }],
      select: {
        id: true,
        day: true,
        startTime: true,
        endTime: true,
        beautyappointments: {
          where: {
            status: { in: ACTIVE_STATUSES },
            date: dateFilter,
          },
          select: { id: true },
        },
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

    return slots.map(({ beautyappointments, ...slot }) => ({
      ...slot,
      isBooked: dateFilter ? beautyappointments.length > 0 : false,
    }));
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

  async update(
    id: string,
    dto: UpdateBeautySlotDto,
    userId: string,
    role: string,
  ) {
    const slot = await this.findOneWithOwner(id);
    this.assertOwnerOrAdmin(slot.beauty.listing.userId, userId, role);

    const startTime = dto.startTime ?? slot.startTime;
    const endTime = dto.endTime ?? slot.endTime;
    if (this.toMinutes(startTime) >= this.toMinutes(endTime)) {
      throw new BadRequestException('startTime must be before endTime');
    }

    await this.assertNoActiveBookings(id, 'update');

    try {
      return await this.prisma.beautySlot.update({
        where: { id },
        data: {
          day: dto.day,
          startTime: dto.startTime,
          endTime: dto.endTime,
        },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new BadRequestException(
          'Slot already exists for this day and time',
        );
      }
      throw e;
    }
  }

  async remove(id: string, userId: string, role: string) {
    const slot = await this.findOneWithOwner(id);
    this.assertOwnerOrAdmin(slot.beauty.listing.userId, userId, role);

    await this.assertNoActiveBookings(id, 'delete');

    // Slots that still have past (COMPLETED / CANCELLED) appointments are
    // referenced by them; Prisma will reject the delete with P2003.
    try {
      await this.prisma.beautySlot.delete({ where: { id } });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2003'
      ) {
        throw new BadRequestException(
          'Slot has appointment history and cannot be deleted',
        );
      }
      throw e;
    }

    return { id, deleted: true };
  }
}