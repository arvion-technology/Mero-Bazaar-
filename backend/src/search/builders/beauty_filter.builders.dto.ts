import { Prisma, ListingCategory } from '@prisma/client';
import { BeautySearchDto } from '../dto/beauty_search.dto';

export function buildBeautyFilter(
  dto: BeautySearchDto,
): Prisma.ListingWhereInput {
  const query = dto.search?.trim();

  return {
    AND: [
      {
        category: ListingCategory.BEAUTY,
      },

      {
        beauty: {
          is: {
            ...(dto.serviceType && {
              serviceType: dto.serviceType,
            }),

            ...(dto.city && {
              city: {
                contains: dto.city,
                mode: 'insensitive',
              },
            }),

            ...(dto.homeVisit !== undefined && {
              homeVisit: dto.homeVisit,
            }),

            ...(dto.bridalAvailable !== undefined && {
              bridalAvailable: dto.bridalAvailable,
            }),

            ...(dto.priceStartingFrom !== undefined && {
              priceStartingFrom: dto.priceStartingFrom,
            }),

            ...((dto.minPrice !== undefined ||
              dto.maxPrice !== undefined) && {
              price: {
                ...(dto.minPrice !== undefined && {
                  gte: dto.minPrice,
                }),
                ...(dto.maxPrice !== undefined && {
                  lte: dto.maxPrice,
                }),
              },
            }),

            ...(query && {
              OR: [
                {
                  city: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              ],
            }),
          },
        },
      },
    ],
  };
}