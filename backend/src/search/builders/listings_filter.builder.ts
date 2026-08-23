<<<<<<< HEAD
import { Prisma } from '@prisma/client';
import { ListingSearchDto } from '../dto/listing_search.dto';

export function buildListingFilter(
  dto: ListingSearchDto,
): Prisma.ListingWhereInput {
=======
import { Prisma } from "@prisma/client";
import { ListingSearchDto } from "../dto/listing_search.dto";

export function buildListingFilter(dto: ListingSearchDto): Prisma.ListingWhereInput {
>>>>>>> origin/aashika
  return {
    ...(dto.query && {
      title: {
        contains: dto.query,
<<<<<<< HEAD
        mode: 'insensitive',
=======
        mode: "insensitive",
>>>>>>> origin/aashika
      },
    }),

    ...(dto.category && {
      category: dto.category,
    }),

<<<<<<< HEAD
    ...(dto.category === 'VEHICLE' && {
=======
    ...(dto.category === "VEHICLE" && {
>>>>>>> origin/aashika
      vehicle: {
        is: {
          ...(dto.query && {
            OR: [
<<<<<<< HEAD
              { brand: { contains: dto.query, mode: 'insensitive' } },
              { model: { contains: dto.query, mode: 'insensitive' } },
=======
              { brand: { contains: dto.query, mode: "insensitive" } },
              { model: { contains: dto.query, mode: "insensitive" } },
>>>>>>> origin/aashika
            ],
          }),
        },
      },
    }),

<<<<<<< HEAD
    ...(dto.category === 'JOB' && {
=======
    ...(dto.category === "JOB" && {
>>>>>>> origin/aashika
      job: {
        is: {
          ...(dto.query && {
            role: {
              contains: dto.query,
<<<<<<< HEAD
              mode: 'insensitive',
=======
              mode: "insensitive",
>>>>>>> origin/aashika
            },
          }),
        },
      },
    }),

<<<<<<< HEAD
    ...(dto.category === 'MEDICAL' && {
      medical: {
        is: {
          ...(dto.query && {
            OR: [{ doctorName: { contains: dto.query, mode: 'insensitive' } }],
=======
    ...(dto.category === "MEDICAL" && {
      medical: {
        is: {
          ...(dto.query && {
            OR: [
              { doctorName: { contains: dto.query, mode: "insensitive" } },
            ],
>>>>>>> origin/aashika
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
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/aashika
