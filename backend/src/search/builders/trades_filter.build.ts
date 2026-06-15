import { Prisma, ListingCategory } from "@prisma/client";
import { TradesSearchDto } from "../dto/trade_search.dto";

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
            mode: "insensitive",
          },
        }),

        ...(dto.ward && {
          ward: {
            contains: dto.ward,
            mode: "insensitive",
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
                mode: "insensitive",
              },
            },
            {
              ward: {
                contains: query,
                mode: "insensitive",
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
}