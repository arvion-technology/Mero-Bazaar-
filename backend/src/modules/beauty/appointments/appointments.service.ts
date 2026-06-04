import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateBeautyAppointmentDto } from './dto/create_beauty_appointment.dto';
import { AppointmentStatus } from '@prisma/client';

@Injectable()
export class BeautyAppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBeautyAppointmentDto) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: dto.listingId },
      include: { beauty: true },
    });

    if (!listing?.beauty) throw new NotFoundException('Beauty service not found');

    const beauty = listing.beauty;

    const slot = await this.prisma.beautySlot.findUnique({
      where: { id: dto.slotId },
    });

    if (!slot) throw new NotFoundException('Slot not found');

    if (slot.beautyId !== beauty.id) {
      throw new BadRequestException('Slot does not belong to this beauty service');
    }

    if (slot.isBooked) throw new BadRequestException('Slot is already booked');

    return this.prisma.$transaction(async (tx) => {
      const appointment = await tx.beautyAppointment.create({
        data: {
          beautyId: beauty.id,
          slotId: dto.slotId,
          listingId: dto.listingId,
          customerId: null, //hardcoded until auth model is ready
          customerName: dto.customerName,
          startTime: new Date(`1970-01-01T${slot.startTime}:00`),
          endTime: new Date(`1970-01-01T${slot.endTime}:00`),
          notes: dto.notes,
          status: AppointmentStatus.PENDING,
        },
      });

      await tx.beautySlot.update({
        where: { id: dto.slotId },
        data: { isBooked: true },
      });

      return appointment;
    });
  }

  async findAll() {
    return this.prisma.beautyAppointment.findMany({
      include: { slot: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByBeauty(listingId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      include: { beauty: true },
    });

    if (!listing?.beauty) throw new NotFoundException('Beauty service not found');

    return this.prisma.beautyAppointment.findMany({
      where: { beautyId: listing.beauty.id },
      include: { slot: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const appointment = await this.prisma.beautyAppointment.findUnique({
      where: { id },
      include: { slot: true },
    });

    if (!appointment) throw new NotFoundException('Appointment not found');

    return appointment;
  }

  async updateStatus(id: string, status: AppointmentStatus) {
    const appointment = await this.findOne(id);

    const allowedTransitions: Record<AppointmentStatus, AppointmentStatus[]> = {
      PENDING: [AppointmentStatus.CONFIRMED, AppointmentStatus.CANCELLED],
      CONFIRMED: [AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED],
      COMPLETED: [],
      CANCELLED: [],
    };

    if (!allowedTransitions[appointment.status].includes(status)) {
      throw new BadRequestException(
        `Cannot transition from ${appointment.status} to ${status}`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.beautyAppointment.update({
        where: { id },
        data: { status },
      });

      if (status === AppointmentStatus.CANCELLED) {
        await tx.beautySlot.update({
          where: { id: appointment.slotId },
          data: { isBooked: false },
        });
      }

      return updated;
    });
  }

  async cancel(appointmentId: string) {
    const appointment = await this.findOne(appointmentId);

    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException('Appointment is already cancelled');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.beautyAppointment.update({
        where: { id: appointmentId },
        data: { status: AppointmentStatus.CANCELLED },
      });

      await tx.beautySlot.update({
        where: { id: appointment.slotId },
        data: { isBooked: false },
      });
      return updated;
    });
  }
}