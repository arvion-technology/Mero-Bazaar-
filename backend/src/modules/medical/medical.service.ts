import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateMedicalDto } from './dto/create_medical.dto';
import { MedicalQueryDto } from './dto/medical_query.dto';
import { MedicalCategory, ListingCategory } from '@prisma/client';

@Injectable()
export class MedicalService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMedicalDto) {
    return this.prisma.listing.create({
      data: {
        category: ListingCategory.MEDICAL,
        title: dto.doctorName,

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
            latitude: dto.latitude ?? null,
            longitude: dto.longitude ?? null,
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
      where: {
        category: ListingCategory.MEDICAL,

        medical: {
          ...(query.city ? { city: query.city } : {}),
          ...(query.speciality ? { speciality: query.speciality } : {}),
          ...(query.doctorName ? { doctorName: query.doctorName } : {}),
          ...(query.homeVisitAvailable !== undefined
            ? { homeVisitAvailable: query.homeVisitAvailable }
            : {}),
        },
      },
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