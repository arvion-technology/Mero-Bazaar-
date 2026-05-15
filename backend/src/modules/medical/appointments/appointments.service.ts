import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateAppointmentDto } from './dto/create_appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAppointmentDto) {
    const startTime = new Date(dto.start_time);
    const endTime = new Date(dto.end_time);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    const doctor = await this.prisma.medicalAndDental.findUnique({
      where: { id: dto.doctorId },
    });

    if (!doctor) {
      throw new BadRequestException('Doctor not found');
    }

    const listing = await this.prisma.listing.findUnique({
      where: { id: dto.listingId },
    });

    if (!listing) {
      throw new BadRequestException('Listing not found');
    }

    const existing = await this.prisma.appointment.findFirst({
      where: {
        doctorId: dto.doctorId,
        status: { not: 'CANCELLED' },
        AND: [
          { start_time: { lt: endTime } },
          { end_time: { gt: startTime } },
        ],
      },
    });

    if (existing) {
      throw new BadRequestException('Slot already booked');
    }

    return this.prisma.appointment.create({
      data: {
        listingId: dto.listingId,
        doctorId: dto.doctorId,
        patientId: dto.patientId,
        patientName: dto.patientName,
        start_time: startTime,
        end_time: endTime,
        notes: dto.notes,
      },
    });
  }

  async getDoctorSchedule(doctorId: string) {
    return this.prisma.appointment.findMany({
      where: { doctorId },
      orderBy: { start_time: 'asc' },
    });
  }

  async updateStatus(id: string, dto: any) {
    return this.prisma.appointment.update({
      where: { id },
      data: { status: dto.status },
    });
  }
}