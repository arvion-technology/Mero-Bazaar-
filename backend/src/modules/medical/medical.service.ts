import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateMedicalDto } from './dto/create_medical.dto';
import { MedicalQueryDto } from './dto/medical_query.dto';
import { ListingCategory, MedicalServiceType } from '@prisma/client';
import { validateAndReencodeImage } from '../../common/uploads/upload.util';

@Injectable()
export class MedicalService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMedicalDto, userId: string) {
    // Bind the claimed identity to the platform-assigned doctor profile: the NMC
    // licence number on the listing must match the account's verified profile.
    const doctor = await this.prisma.doctorProfile.findUnique({
      where: { userId },
    });

    if (doctor) {
      if (doctor.nmcLicenseNumber !== dto.nmcLicenseNumber) {
        throw new ForbiddenException(
          'NMC licence number does not match your verified doctor profile.',
        );
      }
    } else {
      // First-time doctor: seed the profile from the submitted licence. It starts
      // PENDING and only an admin verification document approval flips it to VERIFIED.
      await this.prisma.doctorProfile.create({
        data: {
          userId,
          doctorName: dto.doctorName,
          nmcLicenseNumber: dto.nmcLicenseNumber,
          specialization: dto.specialty,
          clinicAddress: dto.clinicAddress,
        },
      });
    }

    return this.prisma.$transaction(async (tx) => {
      const listing = await tx.listing.create({
        data: {
          category: ListingCategory.MEDICAL,
          title: dto.doctorName,
          user: {
            connect: {
              id: userId,
            },
          },
          medical: {
            create: {
              serviceType: dto.specialty,
              serviceOffered: dto.servicesOffered,
              doctorName: dto.doctorName,
              nmcLicenseNumber: dto.nmcLicenseNumber,
              appointmentFee: dto.appointmentFee,
              homeVisitAvailable: dto.homeVisitAvailable ?? false,
              onlineAppointments: dto.onlineAppointments ?? false,
              clinicAddress: dto.clinicAddress,
              city: dto.city,
              shortBio: dto.shortBio,
              languages: dto.languages ?? [],
              experience: dto.experience,
              slotDurationMinutes: dto.slotDurationMinutes,
              bufferMinutes: dto.bufferMinutes,
              sameDayBooking: dto.sameDayBooking ?? false,
              latitude: dto.latitude ?? null,
              longitude: dto.longitude ?? null,
            },
          },
        },
        include: {
          medical: true,
        },
      });

      if (dto.availableSlots?.length && listing.medical) {
        await tx.medicalSlot.createMany({
          data: dto.availableSlots.map((slot) => ({
            medicalId: listing.medical!.id,
            day: slot.day,
            startTime: slot.startTime,
            endTime: slot.endTime,
          })),
        });
      }

      return listing;
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

            ...(query.specialty && {
              serviceType: query.specialty as MedicalServiceType,
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
        medical: {
          include: { medicalSlots: true },
        },
      },
    });
  }

  async update(id: string, dto: CreateMedicalDto, userId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: { medical: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.userId !== userId) {
      throw new ForbiddenException('Unauthorized');
    }

    return this.prisma.listing.update({
      where: { id },
      data: {
        title: dto.doctorName,
        medical: {
          update: {
            serviceType: dto.specialty as MedicalServiceType,
            serviceOffered: dto.servicesOffered,
            doctorName: dto.doctorName,
            nmcLicenseNumber: dto.nmcLicenseNumber,
            appointmentFee: dto.appointmentFee,
            homeVisitAvailable: dto.homeVisitAvailable ?? false,
            onlineAppointments: dto.onlineAppointments ?? false,
            clinicAddress: dto.clinicAddress,
            city: dto.city,
            shortBio: dto.shortBio,
            languages: dto.languages ?? [],
            experience: dto.experience,
            slotDurationMinutes: dto.slotDurationMinutes,
            bufferMinutes: dto.bufferMinutes,
            sameDayBooking: dto.sameDayBooking ?? false,
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

  async remove(id: string, userId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.userId !== userId) {
      throw new ForbiddenException('Unauthorized');
    }

    return this.prisma.listing.delete({
      where: { id },
    });
  }

  async addPhotos(id: string, files: Express.Multer.File[], userId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: { medical: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (!listing.medical) {
      throw new NotFoundException('Medical and health listing not found');
    }

    if (listing.userId !== userId) {
      throw new ForbiddenException('Unauthorized');
    }

    const newPhotoNames: string[] = [];
    for (const file of files) {
      const finalName = await validateAndReencodeImage(
        file.path,
        './uploads/medical',
      );
      newPhotoNames.push(finalName);
    }

    const newPhotoUrls = newPhotoNames.map(
      (name) => `/uploads/medical/${name}`,
    );
    const updatedImages = [...listing.images, ...newPhotoUrls];

    return this.prisma.listing.update({
      where: { id },
      data: { images: updatedImages },
      include: { medical: true },
    });
  }
}
