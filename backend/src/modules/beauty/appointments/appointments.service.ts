import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateBeautyAppointmentDto } from './dto/create_beauty_appointment.dto';
import { AppointmentStatus } from '@prisma/client';

@Injectable()
export class BeautyAppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBeautyAppointmentDto) {
    const { listingId, slotId, customerId, customerName, notes } = dto;

    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      include: { beauty: true },
    });

    if (!listing?.beauty) {
      throw new NotFoundException('Beauty service not found');
    }

    const beauty = listing.beauty;

    const slot = await this.prisma.beautySlot.findUnique({
      where: { id: slotId },
    });

    if (!slot) {
      throw new NotFoundException('Slot not found');
    }

    if (slot.beautyId !== beauty.id) {
      throw new BadRequestException(
        'Slot does not belong to this beauty service',
      );
    }

    if (slot.isBooked) {
      throw new BadRequestException('Slot already booked');
    }

    return this.prisma.$transaction(async (tx) => {
      const appointment = await tx.beautyAppointment.create({
        data: {
          beautyId: beauty.id,
          slotId,
          customerId,
          customerName,
          startTime: new Date(),
          endTime: new Date(),
          notes,
          status: AppointmentStatus.PENDING,
        },
      });

      await tx.beautySlot.update({
        where: { id: slotId },
        data: { isBooked: true },
      });

      return appointment;
    });
  }

  async findByBeauty(listingId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      include: { beauty: true },
    });

    if (!listing?.beauty) {
      throw new NotFoundException('Beauty service not found');
    }

    return this.prisma.beautyAppointment.findMany({
      where: { beautyId: listing.beauty.id },
      include: { slot: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async cancel(appointmentId: string) {
    return this.prisma.$transaction(async (tx) => {
      const appointment = await tx.beautyAppointment.update({
        where: { id: appointmentId },
        data: {
          status: AppointmentStatus.CANCELLED,
        },
      });

      await tx.beautySlot.update({
        where: { id: appointment.slotId },
        data: { isBooked: false },
      });

      return appointment;
    });
  }
}