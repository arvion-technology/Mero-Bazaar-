import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateBeautyAppointmentDto } from './dto/create_beauty_appointment.dto';
import { AppointmentStatus, Prisma } from '@prisma/client';

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;

@Injectable()
export class BeautyAppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBeautyAppointmentDto, customerId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: dto.listingId },
      include: { beauty: true },
    });

    if (!listing?.beauty)
      throw new NotFoundException('Beauty service not found');

    const beauty = listing.beauty;

    const slot = await this.prisma.beautySlot.findUnique({
      where: { id: dto.slotId },
    });

    if (!slot) throw new NotFoundException('Slot not found');

    if (slot.beautyId !== beauty.id) {
      throw new BadRequestException(
        'Slot does not belong to this beauty service',
      );
    }

    const date = new Date(`${dto.date}T00:00:00.000Z`);
    if (isNaN(date.getTime())) throw new BadRequestException('Invalid date');

    const todayNp = new Date().toLocaleDateString('en-CA', {
      timeZone: 'Asia/Kathmandu',
    });
    if (dto.date < todayNp) throw new BadRequestException('Date is in the past');

    if (WEEKDAYS[date.getUTCDay()] !== slot.day) {
      throw new BadRequestException(`That date is not a ${slot.day}`);
    }

    try {
      return await this.prisma.beautyAppointment.create({
        data: {
          beautyId: beauty.id,
          slotId: dto.slotId,
          listingId: dto.listingId,
          customerId,
          customerName: dto.customerName,
          date,
          startTime: new Date(`1970-01-01T${slot.startTime}:00`),
          endTime: new Date(`1970-01-01T${slot.endTime}:00`),
          notes: dto.notes,
          status: AppointmentStatus.PENDING,
        },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new BadRequestException('Slot is already booked for that date');
      }
      throw e;
    }
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

    if (!listing?.beauty)
      throw new NotFoundException('Beauty service not found');

    if (role !== 'ADMIN' && listing.userId !== userId) {
      throw new ForbiddenException(
        'You do not have access to these appointments',
      );
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
    appointment: {
      customerId: string | null;
      beauty: { listing: { userId: string } | null } | null;
    },
    userId: string,
    role: string,
  ) {
    const isCustomer = appointment.customerId === userId;
    const isProvider = appointment.beauty?.listing?.userId === userId;

    if (role !== 'ADMIN' && !isCustomer && !isProvider) {
      throw new ForbiddenException(
        'You do not have access to this appointment',
      );
    }
  }

  async findOne(id: string, userId: string, role: string) {
    const appointment = await this.findWithOwnerContext(id);
    this.assertCanAccess(appointment, userId, role);
    return appointment;
  }

  async updateStatus(
    id: string,
    status: AppointmentStatus,
    userId: string,
    role: string,
  ) {
    const appointment = await this.findWithOwnerContext(id);
    const isProvider = appointment.beauty?.listing?.userId === userId;

    if (role !== 'ADMIN' && !isProvider) {
      throw new ForbiddenException(
        'Only the provider or an admin can update appointment status',
      );
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

    // Optimistic concurrency: only update if status is still what we read.
    // Cancelling frees the slot automatically (the unique index only covers
    // PENDING / CONFIRMED appointments).
    const result = await this.prisma.beautyAppointment.updateMany({
      where: { id, status: appointment.status },
      data: { status },
    });

    if (result.count === 0) {
      throw new ConflictException(
        'Appointment status changed concurrently, please retry',
      );
    }

    return this.prisma.beautyAppointment.findUniqueOrThrow({ where: { id } });
  }

  async cancel(appointmentId: string, userId: string, role: string) {
    const appointment = await this.findWithOwnerContext(appointmentId);
    this.assertCanAccess(appointment, userId, role);

    if (
      appointment.status === AppointmentStatus.COMPLETED ||
      appointment.status === AppointmentStatus.CANCELLED
    ) {
      throw new BadRequestException(
        `Cannot cancel a ${appointment.status} appointment`,
      );
    }

    const result = await this.prisma.beautyAppointment.updateMany({
      where: { id: appointmentId, status: appointment.status },
      data: { status: AppointmentStatus.CANCELLED },
    });

    if (result.count === 0) {
      throw new ConflictException('Appointment changed, please retry');
    }

    return this.prisma.beautyAppointment.findUniqueOrThrow({
      where: { id: appointmentId },
    });
  }
}