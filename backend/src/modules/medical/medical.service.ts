import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { MedicalCategory } from '@prisma/client';
import { CreateMedicalDto } from './dto/create_medical.dto';
import { CreateAppointmentDto } from './appointments/dto/create_appointment.dto';
import { UpdateAppointmentStatusDto } from './appointments/dto/update_appointment_status.dto';
import { MedicalQueryDto } from './dto/medical_query.dto';

@Injectable()
export class MedicalService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMedicalDto) {
    return this.prisma.listing.create({
      data: {
        title: dto.doctorName,
        description: dto.speciality,
        medical: {
          create: {
            category: dto.category as MedicalCategory,
            doctorName: dto.doctorName,
            speciality: dto.speciality,
            nmcLicenseNumber: dto.nmcLicenseNumber,
            appointmentFee: dto.appointmentFee,
            availableSlots: dto.availableSlots,
            clinicAddress: dto.clinicAddress,
            city: dto.city,
            latitude: dto.latitude,
            longitude: dto.longitude,
          },
        },
      },

      include: {
        medical: true,
      },
    });
  }

  async findAll(query: MedicalQueryDto) {
    return this.prisma.listing.findMany({
      include: {
        medical: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.listing.findUnique({
      where: { id },

      include: {
        medical: true,
      },
    });
  }
}