<<<<<<< HEAD
import { Prisma, ListingCategory } from '@prisma/client';
import { TradesSearchDto } from '../dto/trade_search.dto';
=======
import { Prisma, ListingCategory } from "@prisma/client";
import { TradesSearchDto } from "../dto/trade_search.dto";
>>>>>>> origin/aashika

export function buildTradesFilter(
  dto: TradesSearchDto,
): Prisma.ListingWhereInput {
  const query = dto.query?.trim();

  return {
    category: ListingCategory.TRADES,

    trades: {
      is: {
        ...(dto.city && {
          city: {
            contains: dto.city,
<<<<<<< HEAD
            mode: 'insensitive',
=======
            mode: "insensitive",
>>>>>>> origin/aashika
          },
        }),

        ...(dto.ward && {
          ward: {
            contains: dto.ward,
<<<<<<< HEAD
            mode: 'insensitive',
=======
            mode: "insensitive",
>>>>>>> origin/aashika
          },
        }),

        ...(dto.skillTags?.length && {
          skillTags: {
            hasSome: dto.skillTags,
          },
        }),

        ...(dto.emergency !== undefined && {
          emergencyAvailable: dto.emergency,
        }),

        ...(dto.warrantyGiven !== undefined && {
          warrantyGiven: dto.warrantyGiven,
        }),

        ...(dto.maxCalloutCharge !== undefined && {
          calloutCharge: {
            lte: dto.maxCalloutCharge,
          },
        }),

        ...(query && {
          OR: [
            {
              city: {
                contains: query,
<<<<<<< HEAD
                mode: 'insensitive',
=======
                mode: "insensitive",
>>>>>>> origin/aashika
              },
            },
            {
              ward: {
                contains: query,
<<<<<<< HEAD
                mode: 'insensitive',
=======
                mode: "insensitive",
>>>>>>> origin/aashika
              },
            },
            {
              skillTags: {
                hasSome: [query],
              },
            },
          ],
        }),
      },
    },

    ...(dto.latitude &&
      dto.longitude &&
      dto.radiusKm && {
        latitude: {
          gte: dto.latitude - dto.radiusKm / 111,
          lte: dto.latitude + dto.radiusKm / 111,
        },
        longitude: {
          gte: dto.longitude - dto.radiusKm / 111,
          lte: dto.longitude + dto.radiusKm / 111,
        },
      }),
  };
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/aashika
