import { Prisma, ListingCategory, VerificationStatus } from "@prisma/client";
import { MedicalSearchDto } from "../dto/medical_search.dto";

export function buildMedicalFilter(
  dto: MedicalSearchDto,
): Prisma.ListingWhereInput {
  const query = dto.query?.trim();

  return {
    category: ListingCategory.MEDICAL,

    medical: {
      is: {
        ...(dto.city && {
          city: {
            contains: dto.city,
            mode: "insensitive",
          },
        }),

        ...(dto.specialty && {
          specialty: {
            contains: dto.specialty,
            mode: "insensitive",
          },
        }),

        ...(dto.homeVisitAvailable !== undefined && {
          homeVisitAvailable: dto.homeVisitAvailable,
        }),

        ...(dto.isVerified !== undefined && {
          verificationStatus: dto.isVerified
            ? VerificationStatus.VERIFIED
            : VerificationStatus.PENDING,
        }),

        ...((dto.minFee !== undefined || dto.maxFee !== undefined) && {
          appointmentFee: {
            ...(dto.minFee !== undefined && { gte: dto.minFee }),
            ...(dto.maxFee !== undefined && { lte: dto.maxFee }),
          },
        }),

        ...(query && {
          OR: [
            {
              doctorName: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              specialty: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
        }),
      },
    },
  };
}