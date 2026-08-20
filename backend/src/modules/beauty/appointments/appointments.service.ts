import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateBeautyAppointmentDto } from './dto/create_beauty_appointment.dto';
import { AppointmentStatus } from '@prisma/client';

@Injectable()
export class BeautyAppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBeautyAppointmentDto, customerId: string) {
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
          customerId,
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

  async findMine(customerId: string) {
    return this.prisma.beautyAppointment.findMany({
      where: { customerId },
      include: { slot: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByBeauty(listingId: string, userId: string, role: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      include: { beauty: true },
    });

    if (!listing?.beauty) throw new NotFoundException('Beauty service not found');

    if (role !== 'ADMIN' && listing.userId !== userId) {
      throw new ForbiddenException('You do not have access to these appointments');
    }

    return this.prisma.beautyAppointment.findMany({
      where: { beautyId: listing.beauty.id },
      include: { slot: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async findWithOwnerContext(id: string) {
    const appointment = await this.prisma.beautyAppointment.findUnique({
      where: { id },
      include: {
        slot: true,
        beauty: { include: { listing: true } },
      },
    });

    if (!appointment) throw new NotFoundException('Appointment not found');
    return appointment;
  }

  private assertCanAccess(
    appointment: { customerId: string | null; beauty: { listing: { userId: string } | null } | null },
    userId: string,
    role: string,
  ) {
    const isCustomer = appointment.customerId === userId;
    const isProvider = appointment.beauty?.listing?.userId === userId;

    if (role !== 'ADMIN' && !isCustomer && !isProvider) {
      throw new ForbiddenException('You do not have access to this appointment');
    }
  }

  async findOne(id: string, userId: string, role: string) {
    const appointment = await this.findWithOwnerContext(id);
    this.assertCanAccess(appointment, userId, role);
    return appointment;
  }

  async updateStatus(id: string, status: AppointmentStatus, userId: string, role: string) {
    const appointment = await this.findWithOwnerContext(id);
    const isProvider = appointment.beauty?.listing?.userId === userId;

    if (role !== 'ADMIN' && !isProvider) {
      throw new ForbiddenException('Only the provider or an admin can update appointment status');
    }

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

  async cancel(appointmentId: string, userId: string, role: string) {
    const appointment = await this.findWithOwnerContext(appointmentId);
    this.assertCanAccess(appointment, userId, role);

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