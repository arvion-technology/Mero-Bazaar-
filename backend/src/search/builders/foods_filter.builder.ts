import { contain } from "supertest/lib/cookies";
import { SearchFoodsDto } from "../dto/foods_search.dto";
import { FoodType, PriceUnit } from "@prisma/client";
import { Prisma } from "@prisma/client";

export function buildFoodsFilter(query: SearchFoodsDto): Prisma.ListingWhereInput {
  return {
    category: 'FOODS',

    ...(query.keyword && {
        OR: [
          {
            title: {
                contains:query.keyword,
                mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query.keyword,
              mode: 'insensitive',
            },
          },
        ],
    }),
    foods: {
      is: {
        ...(query.foodType && { foodType: query.foodType }),
        ...(query.priceUnit && { priceUnit: query.priceUnit }),
        ...(query.subscriptionAvailable !== undefined && {
          subscriptionAvailable: query.subscriptionAvailable,
        }),

        ...(query.deliveryRadiusKm && {
          deliveryRadiusKm: {
            gte: query.deliveryRadiusKm,
          },
        }),
        ...(query.deliveryDays?.length && {
          deliveryDays: {
            hasSome: query.deliveryDays,
        },
        }),
        ...(query.minOrderAmount && {
          minOrderAmount: {
            gte: query.minOrderAmount,
          },
        }),
      },
    },
    ...(query.minPrice || query.maxPrice
        ? {
            price: {
              ...(query.minPrice && { get: query.minPrice }),
              ...(query.maxPrice && { lte: query.maxPrice }),
            },
        }
        : {})
  };
}