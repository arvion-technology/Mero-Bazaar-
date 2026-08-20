import { Injectable, NotFoundException, BadRequestException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateMedicalAppointmentDto } from './dto/create_medical_appointment.dto';
import { AppointmentStatus } from '@prisma/client';

@Injectable()
export class MedicalAppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMedicalAppointmentDto, patientId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: dto.listingId },
      include: { medical: true },
    });

    if (!listing?.medical) throw new NotFoundException('Medical service not found');

    const medical = listing.medical;

    const slot = await this.prisma.medicalSlot.findUnique({
      where: { id: dto.slotId },
    });

    if (!slot) throw new NotFoundException('Slot not found');

    if (slot.medicalId !== medical.id) {
      throw new BadRequestException('Slot does not belong to this medical service');
    }

    return this.prisma.$transaction(async (tx) => {
      const slotClaim = await tx.medicalSlot.updateMany({
        where: { id: dto.slotId, isBooked: false },
        data: { isBooked: true },
      });

      if (slotClaim.count === 0) {
        throw new BadRequestException('Slot is already booked');
      }

      return tx.medicalAppointment.create({
        data: {
          medicalId: medical.id,
          slotId: dto.slotId,
          listingId: dto.listingId,
          patientId,
          patientName: dto.patientName,
          startTime: new Date(`1970-01-01T${slot.startTime}:00`),
          endTime: new Date(`1970-01-01T${slot.endTime}:00`),
          notes: dto.notes,
          status: AppointmentStatus.PENDING,
        },
      });
    });
  }

  async findAll() {
    return this.prisma.medicalAppointment.findMany({
      include: { slot: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findMine(patientId: string) {
    return this.prisma.medicalAppointment.findMany({
      where: { patientId },
      include: { slot: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByMedical(listingId: string, userId: string, role: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      include: { medical: true },
    });

    if (!listing?.medical) throw new NotFoundException('medical service not found');

    if (role !== 'ADMIN' && listing.userId !== userId) {
      throw new ForbiddenException('You do not have access to these appointments');
    }

    return this.prisma.medicalAppointment.findMany({
      where: { medicalId: listing.medical.id },
      include: { slot: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async findWithOwnerContext(id: string) {
    const appointment = await this.prisma.medicalAppointment.findUnique({
      where: { id },
      include: {
        slot: true,
        medical: { include: { listing: true } },
      },
    });

    if (!appointment) throw new NotFoundException('Appointment not found');
    return appointment;
  }

  private assertCanAccess(
    appointment: { patientId: string | null; medical: { listing: { userId: string } | null } | null },
    userId: string,
    role: string,
  ) {
    const isPatient = appointment.patientId === userId;
    const isProvider = appointment.medical?.listing?.userId === userId;

    if (role !== 'ADMIN' && !isPatient && !isProvider) {
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
    const isProvider = appointment.medical?.listing?.userId === userId;

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
      const result = await tx.medicalAppointment.updateMany({
        where: { id, status: appointment.status },
        data: { status },
      });

      if (result.count === 0) {
        throw new ConflictException('Appointment status changed concurrently, please retry');
      }

      if (status === AppointmentStatus.CANCELLED) {
        await tx.medicalSlot.updateMany({
          where: { id: appointment.slotId, isBooked: true },
          data: { isBooked: false },
        });
      }

      return tx.medicalAppointment.findUniqueOrThrow({ where: { id } });
    });
  }

  async cancel(appointmentId: string, userId: string, role: string) {
    const appointment = await this.findWithOwnerContext(appointmentId);
    this.assertCanAccess(appointment, userId, role);

    return this.prisma.$transaction(async (tx) => {
      const result = await tx.medicalAppointment.updateMany({
        where: { id: appointmentId, status: { not: AppointmentStatus.CANCELLED } },
        data: { status: AppointmentStatus.CANCELLED },
      });

      if (result.count === 0) {
        throw new BadRequestException('Appointment is already cancelled');
      }

      await tx.medicalSlot.updateMany({
        where: { id: appointment.slotId, isBooked: true },
        data: { isBooked: false },
      });

      return tx.medicalAppointment.findUniqueOrThrow({ where: { id: appointmentId } });
    });
  }
}