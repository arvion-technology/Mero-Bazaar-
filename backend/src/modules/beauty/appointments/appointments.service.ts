<<<<<<< HEAD
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
=======
import { Injectable, NotFoundException, BadRequestException, ForbiddenException, ConflictException } from '@nestjs/common';
>>>>>>> origin/aashika
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

<<<<<<< HEAD
    if (!listing?.beauty)
      throw new NotFoundException('Beauty service not found');
=======
    if (!listing?.beauty) throw new NotFoundException('Beauty service not found');
>>>>>>> origin/aashika

    const beauty = listing.beauty;

    const slot = await this.prisma.beautySlot.findUnique({
      where: { id: dto.slotId },
    });

    if (!slot) throw new NotFoundException('Slot not found');

    if (slot.beautyId !== beauty.id) {
<<<<<<< HEAD
      throw new BadRequestException(
        'Slot does not belong to this beauty service',
      );
=======
      throw new BadRequestException('Slot does not belong to this beauty service');
>>>>>>> origin/aashika
    }

    return this.prisma.$transaction(async (tx) => {
      const slotClaim = await tx.beautySlot.updateMany({
        where: { id: dto.slotId, isBooked: false },
        data: { isBooked: true },
      });

      if (slotClaim.count === 0) {
        throw new BadRequestException('Slot is already booked');
      }

      return tx.beautyAppointment.create({
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

<<<<<<< HEAD
    if (!listing?.beauty)
      throw new NotFoundException('Beauty service not found');

    if (role !== 'ADMIN' && listing.userId !== userId) {
      throw new ForbiddenException(
        'You do not have access to these appointments',
      );
=======
    if (!listing?.beauty) throw new NotFoundException('Beauty service not found');

    if (role !== 'ADMIN' && listing.userId !== userId) {
      throw new ForbiddenException('You do not have access to these appointments');
>>>>>>> origin/aashika
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
<<<<<<< HEAD
    appointment: {
      customerId: string | null;
      beauty: { listing: { userId: string } | null } | null;
    },
=======
    appointment: { customerId: string | null; beauty: { listing: { userId: string } | null } | null },
>>>>>>> origin/aashika
    userId: string,
    role: string,
  ) {
    const isCustomer = appointment.customerId === userId;
    const isProvider = appointment.beauty?.listing?.userId === userId;

    if (role !== 'ADMIN' && !isCustomer && !isProvider) {
<<<<<<< HEAD
      throw new ForbiddenException(
        'You do not have access to this appointment',
      );
=======
      throw new ForbiddenException('You do not have access to this appointment');
>>>>>>> origin/aashika
    }
  }

  async findOne(id: string, userId: string, role: string) {
    const appointment = await this.findWithOwnerContext(id);
    this.assertCanAccess(appointment, userId, role);
    return appointment;
  }

<<<<<<< HEAD
  async updateStatus(
    id: string,
    status: AppointmentStatus,
    userId: string,
    role: string,
  ) {
=======
  async updateStatus(id: string, status: AppointmentStatus, userId: string, role: string) {
>>>>>>> origin/aashika
    const appointment = await this.findWithOwnerContext(id);
    const isProvider = appointment.beauty?.listing?.userId === userId;

    if (role !== 'ADMIN' && !isProvider) {
<<<<<<< HEAD
      throw new ForbiddenException(
        'Only the provider or an admin can update appointment status',
      );
=======
      throw new ForbiddenException('Only the provider or an admin can update appointment status');
>>>>>>> origin/aashika
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
      const result = await tx.beautyAppointment.updateMany({
        where: { id, status: appointment.status },
        data: { status },
      });

      if (result.count === 0) {
<<<<<<< HEAD
        throw new ConflictException(
          'Appointment status changed concurrently, please retry',
        );
=======
        throw new ConflictException('Appointment status changed concurrently, please retry');
>>>>>>> origin/aashika
      }

      if (status === AppointmentStatus.CANCELLED) {
        await tx.beautySlot.updateMany({
          where: { id: appointment.slotId, isBooked: true },
          data: { isBooked: false },
        });
      }

      return tx.beautyAppointment.findUniqueOrThrow({ where: { id } });
    });
  }

  async cancel(appointmentId: string, userId: string, role: string) {
    const appointment = await this.findWithOwnerContext(appointmentId);
    this.assertCanAccess(appointment, userId, role);

    return this.prisma.$transaction(async (tx) => {
      const result = await tx.beautyAppointment.updateMany({
<<<<<<< HEAD
        where: {
          id: appointmentId,
          status: { not: AppointmentStatus.CANCELLED },
        },
=======
        where: { id: appointmentId, status: { not: AppointmentStatus.CANCELLED } },
>>>>>>> origin/aashika
        data: { status: AppointmentStatus.CANCELLED },
      });

      if (result.count === 0) {
        throw new BadRequestException('Appointment is already cancelled');
      }

      await tx.beautySlot.updateMany({
        where: { id: appointment.slotId, isBooked: true },
        data: { isBooked: false },
      });

<<<<<<< HEAD
      return tx.beautyAppointment.findUniqueOrThrow({
        where: { id: appointmentId },
      });
    });
  }
}
=======
      return tx.beautyAppointment.findUniqueOrThrow({ where: { id: appointmentId } });
    });
  }
}
>>>>>>> origin/aashika
