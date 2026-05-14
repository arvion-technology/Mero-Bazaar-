import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateAppointmentDto } from './dto/create_appointment.dto';
import { UpdateAppointmentStatusDto } from './dto/update_appointment_status.dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAppointmentDto) {
    return this.prisma.appointment.create({
      data: dto,
    });
  }

  async updateStatus(
    id: string,
    dto: UpdateAppointmentStatusDto,
  ) {
    return this.prisma.appointment.update({
      where: { id },
      data: {
        status: dto.status,
      },
    });
  }
}