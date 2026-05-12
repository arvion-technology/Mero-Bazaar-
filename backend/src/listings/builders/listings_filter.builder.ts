import { Prisma } from "@prisma/client";
import { SearchListingDto } from "../dto/search_listing.dto";

export function buildListingFilter(
  dto: SearchListingDto,
): Prisma.ListingWhereInput {
  return {
    ...(dto.title && {
      title: {
        contains: dto.title,
        mode: "insensitive",
      },
    }),

    ...(dto.category && {
      category: dto.category,
    }),

    ...((dto.minPrice !== undefined || dto.maxPrice !== undefined) && {
      price: {
        ...(dto.minPrice !== undefined && { gte: dto.minPrice }),
        ...(dto.maxPrice !== undefined && { lte: dto.maxPrice }),
      },
    }),
  };
}