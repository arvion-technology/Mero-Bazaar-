import { Prisma } from "@prisma/client";
import { ListingSearchDto } from "../dto/listing_search.dto";

export function buildListingFilter(dto: ListingSearchDto): Prisma.ListingWhereInput {
  return {
    ...(dto.query && {
      title: {
        contains: dto.query,
        mode: "insensitive",
      },
    }),

    ...(dto.category && {
      category: dto.category,
    }),

    ...(dto.category === "VEHICLE" && {
      vehicle: {
        is: {
          ...(dto.query && {
            OR: [
              { brand: { contains: dto.query, mode: "insensitive" } },
              { model: { contains: dto.query, mode: "insensitive" } },
            ],
          }),
        },
      },
    }),

    ...(dto.category === "JOB" && {
      job: {
        is: {
          ...(dto.query && {
            role: {
              contains: dto.query,
              mode: "insensitive",
            },
          }),
        },
      },
    }),

    ...(dto.category === "MEDICAL" && {
      medical: {
        is: {
          ...(dto.query && {
            OR: [
              { doctorName: { contains: dto.query, mode: "insensitive" } },
              { specialty: { contains: dto.query, mode: "insensitive" } },
            ],
          }),
        },
      },
    }),

    ...(dto.minPrice !== undefined || dto.maxPrice !== undefined
      ? {
          price: {
            ...(dto.minPrice !== undefined && { gte: dto.minPrice }),
            ...(dto.maxPrice !== undefined && { lte: dto.maxPrice }),
          },
        }
      : {}),
  };
}