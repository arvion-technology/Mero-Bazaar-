import { Prisma, ListingCategory } from '@prisma/client';
import { SecondHandSearchDto } from '../dto/secondhand_search.dto';

export function buildSecondHandFilter(
  dto: SecondHandSearchDto,
): Prisma.ListingWhereInput {
  const query = dto.search?.trim();

  return {
    AND: [
      {
        category: ListingCategory.SECONDHAND,
      },
      {
        secondhand: {
          is: {
            ...(dto.category && { category: dto.category }),
            ...(dto.condition && { condition: dto.condition }),
            ...(dto.city && {
              city: {
                contains: dto.city,
                mode: Prisma.QueryMode.insensitive,
              },
            }),
            ...(dto.status && { status: dto.status }),
            ...(dto.isNegotiable !== undefined && {
              isNegotiable: dto.isNegotiable,
            }),
            ...((dto.minPrice !== undefined || dto.maxPrice !== undefined) && {
              price: {
                ...(dto.minPrice !== undefined && { gte: dto.minPrice }),
                ...(dto.maxPrice !== undefined && { lte: dto.maxPrice }),
              },
            }),
          },
        },
      },
      ...(query
        ? [
            {
              OR: [
                {
                  secondhand: {
                    is: {
                      itemName: {
                        contains: query,
                        mode: Prisma.QueryMode.insensitive,
                      },
                    },
                  },
                },
                {
                  secondhand: {
                    is: {
                      description: {
                        contains: query,
                        mode: Prisma.QueryMode.insensitive,
                      },
                    },
                  },
                },
                {
                  secondhand: {
                    is: {
                      city: {
                        contains: query,
                        mode: Prisma.QueryMode.insensitive,
                      },
                    },
                  },
                },
              ],
            },
          ]
        : []),
    ],
  };
}