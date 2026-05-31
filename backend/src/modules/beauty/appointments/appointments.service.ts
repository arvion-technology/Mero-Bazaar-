import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateBeautyAppointmentDto } from './dto/create_beauty_appointment.dto';
import { AppointmentStatus } from '@prisma/client';

@Injectable()
export class BeautyAppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto:CreateBeautyAppointmentDto) {
    const { beautyId, slotId, customerId, customerName, notes } = dto;

    const beauty =await this.prisma.hairBeautyAndWellness.findUnique({
      where: { id: beautyId },
    });
    if (!beauty) {
      throw new NotFoundException('Beauty service not found');
    }

    const slot = await this.prisma.beautySlot.findUnique({
      where: { id: slotId },
    });
    if (!slot) {
      throw new NotFoundException('SLot not found!');
    }

    if (slot.beautyId !== beautyId) {
      throw new BadRequestException('Slot doesnot belong to this beauty service');
    }

    if (slot.isBooked) {
      throw new BadRequestException('Slot already booked');
    }

    return this.prisma.$transaction(async (tx) => {
      const appointment = await tx.beautyAppointment.create({
        data: {
          beautyId,
          slotId,
          customerId,
          customerName,
          startTime: new Date(slot.startTime),
          endTime: new Date(slot.endTime),
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

  async findByBeauty(beautyId: string) {
    return this.prisma.beautyAppointment.findMany({
      where: { beautyId },
      include: {
        slot: true,
      },
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
