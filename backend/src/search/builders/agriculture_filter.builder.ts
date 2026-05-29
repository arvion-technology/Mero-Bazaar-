import { Prisma, ListingCategory } from '@prisma/client';
import { AgricultureSearchDto } from '../dto/agriculture_search.dto';

export function buildAgricultureFilter(
  dto: AgricultureSearchDto,
): Prisma.ListingWhereInput {
  const query = dto.search?.trim();

  return {
    AND: [
      {
        category: ListingCategory.AGRICULTURE,
      },

      {
        agriculture: {
          is: {
            ...(dto.listingType && { listingType: dto.listingType }),

            ...(dto.unit && { unit: dto.unit }),

            ...(dto.healthVaccineStatus && {
              healthVaccineStatus: dto.healthVaccineStatus,
            }),

            ...(dto.district && {
              district: {
                contains: dto.district,
                mode: 'insensitive',
              },
            }),

            ...(dto.village && {
              village: {
                contains: dto.village,
                mode: 'insensitive',
              },
            }),

            ...(dto.location && {
              location: {
                contains: dto.location,
                mode: 'insensitive',
              },
            }),

            ...(dto.organicCertified !== undefined && {
              organicCertified: dto.organicCertified,
            }),

            ...(dto.organicVerified !== undefined && {
              organicVerified: dto.organicVerified,
            }),

            ...((dto.minPrice !== undefined || dto.maxPrice !== undefined) && {
              pricePerUnit: {
                ...(dto.minPrice !== undefined && { gte: dto.minPrice }),
                ...(dto.maxPrice !== undefined && { lte: dto.maxPrice }),
              },
            }),

            ...(dto.age !== undefined && {
              age: dto.age,
            }),

            ...(query && {
              OR: [
                { district: { contains: query, mode: 'insensitive' } },
                { village: { contains: query, mode: 'insensitive' } },
                { location: { contains: query, mode: 'insensitive' } },
                { animalType: { contains: query, mode: 'insensitive' } },
                { breed: { contains: query, mode: 'insensitive' } },
              ],
            }),
          },
        },
      },
    ],
  };
}