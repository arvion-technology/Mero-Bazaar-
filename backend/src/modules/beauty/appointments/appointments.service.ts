import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateBeautyAppointmentDto } from './dto/create_beauty_appointment.dto';
import {
  AppointmentStatus,
  NotificationCategory,
  Prisma,
} from '@prisma/client';

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;

// Appointments in these states occupy a slot on their date.
const ACTIVE_STATUSES: AppointmentStatus[] = [
  AppointmentStatus.PENDING,
  AppointmentStatus.CONFIRMED,
];

@Injectable()
export class BeautyAppointmentsService {
  private readonly logger = new Logger(BeautyAppointmentsService.name);

  constructor(private prisma: PrismaService) {}

  // BeautyAppointment has no `customer` relation, so look users up by id.
  private async attachCustomers<T extends { customerId: string | null }>(
    rows: T[],
  ) {
    const ids = [
      ...new Set(
        rows.map((r) => r.customerId).filter((id): id is string => !!id),
      ),
    ];
    const users = ids.length
      ? await this.prisma.user.findMany({
          where: { id: { in: ids } },
          select: { id: true, name: true, phone: true },
        })
      : [];
    const byId = new Map(users.map((u) => [u.id, u]));
    return rows.map((r) => ({
      ...r,
      user: r.customerId ? (byId.get(r.customerId) ?? null) : null,
    }));
  }

  //failed notification must never fail the booking itself.
  private async notify(
    userId: string | null | undefined,
    type: string,
    title: string,
    description: string,
    appointmentId: string,
  ) {
    if (!userId) return;
    try {
      await this.prisma.notification.create({
        data: {
          userId,
          category: NotificationCategory.APPOINTMENTS,
          type,
          title,
          description,
          entityId: appointmentId,
          entityType: 'BeautyAppointment',
        },
      });
    } catch (e) {
      this.logger.warn(`Notification failed: ${(e as Error).message}`);
    }
  }

  async create(dto: CreateBeautyAppointmentDto, customerId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: dto.listingId },
      include: { beauty: true },
    });

    if (!listing?.beauty)
      throw new NotFoundException('Beauty service not found');

    if (listing.userId === customerId) {
      throw new BadRequestException('You cannot book your own service');
    }

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

    // Schema has no unique constraint on (slotId, date), so check here.
    // Add the partial unique index below to make this race-proof.
    const taken = await this.prisma.beautyAppointment.findFirst({
      where: {
        slotId: dto.slotId,
        date,
        status: { in: ACTIVE_STATUSES },
      },
      select: { id: true },
    });
    if (taken) {
      throw new BadRequestException('Slot is already booked for that date');
    }

    let appointment;
    try {
      appointment = await this.prisma.beautyAppointment.create({
        data: {
          beautyId: beauty.id,
          slotId: dto.slotId,
          listingId: dto.listingId,
          customerId,
          customerName: dto.customerName,
          date,
          // Explicit Z so the time is stored as UTC, not server-local
          startTime: new Date(`1970-01-01T${slot.startTime}:00.000Z`),
          endTime: new Date(`1970-01-01T${slot.endTime}:00.000Z`),
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

    await this.notify(
      listing.userId,
      'APPOINTMENT_REQUESTED',
      'New booking request',
      `${dto.customerName} requested "${listing.title}" on ${dto.date}, ${slot.startTime} - ${slot.endTime}.`,
      appointment.id,
    );

    return appointment;
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
      include: {
        slot: true,
        beauty: {
          include: { listing: { select: { id: true, title: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySeller(sellerId: string) {
    const rows = await this.prisma.beautyAppointment.findMany({
      where: { beauty: { listing: { userId: sellerId } } },
      include: {
        slot: true,
        beauty: {
          include: { listing: { select: { id: true, title: true } } },
        },
      },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    });
    return this.attachCustomers(rows);
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

    const rows = await this.prisma.beautyAppointment.findMany({
      where: { beautyId: listing.beauty.id },
      include: { slot: true },
      orderBy: { createdAt: 'desc' },
    });
    return this.attachCustomers(rows);
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

    const result = await this.prisma.beautyAppointment.updateMany({
      where: { id, status: appointment.status },
      data: { status },
    });

    if (result.count === 0) {
      throw new ConflictException(
        'Appointment status changed concurrently, please retry',
      );
    }

    const title = appointment.beauty?.listing?.title ?? 'your service';
    const label = status.toLowerCase();
    await this.notify(
      appointment.customerId,
      `APPOINTMENT_${status}`,
      `Booking ${label}`,
      `Your booking for "${title}" was ${label}.`,
      id,
    );

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

    // Tell whoever didn't cancel.
    const sellerId = appointment.beauty?.listing?.userId;
    const title = appointment.beauty?.listing?.title ?? 'a service';
    const cancelledByCustomer = appointment.customerId === userId;
    await this.notify(
      cancelledByCustomer ? sellerId : appointment.customerId,
      'APPOINTMENT_CANCELLED',
      'Booking cancelled',
      cancelledByCustomer
        ? `${appointment.customerName} cancelled their booking for "${title}".`
        : `Your booking for "${title}" was cancelled by the provider.`,
      appointmentId,
    );

    return this.prisma.beautyAppointment.findUniqueOrThrow({
      where: { id: appointmentId },
    });
  }
}