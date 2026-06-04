import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateMedicalDto } from './dto/create_medical.dto';
import { MedicalQueryDto } from './dto/medical_query.dto';
import { ListingCategory } from '@prisma/client';

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
            doctorName: dto.doctorName,
            nmcLicenseNumber: dto.nmcLicenseNumber,
            appointmentFee: dto.appointmentFee,
            clinicAddress: dto.clinicAddress,
            city: dto.city,

            homeVisitAvailable: dto.homeVisitAvailable ?? false,

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
          is: {
            ...(query.city && {
              city: query.city,
            }),

            ...(query.doctorName && {
              doctorName: {
                contains: query.doctorName,
                mode: 'insensitive',
              },
            }),

            ...(query.homeVisitAvailable !== undefined && {
              homeVisitAvailable: query.homeVisitAvailable,
            }),
          },
        },
      },

      include: {
        medical: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.listing.findFirst({
      where: {
        id,
        category: ListingCategory.MEDICAL,
      },
      include: {
        medical: true,
      },
    });
  }
}