import { Prisma, ListingCategory, OwnerType, PropertyType, ListingType } from '@prisma/client';
import { RentalSearchDto } from '../dto/rental_search.dto';

export function buildRentalFilter(
  dto: RentalSearchDto,
): Prisma.ListingWhereInput {
  const query = dto.search?.trim();

  return {
    category: ListingCategory.RENTAL,

    rental: {
      is: {
        ...(dto.city && {
          city: {
            contains: dto.city,
            mode: 'insensitive',
          },
        }),

        ...(dto.area && {
          area: {
            contains: dto.area,
            mode: 'insensitive',
          },
        }),

        ...(dto.propertyType && {
          propertyType: dto.propertyType,
        }),

        ...(dto.listingType && {
          listingType: dto.listingType,
        }),

        ...(dto.ownerType && {
          isOwnerOrAgent: dto.ownerType,
        }),

        ...(dto.bedrooms !== undefined && {
          bedrooms: dto.bedrooms,
        }),

        ...(dto.bathrooms !== undefined && {
          bathrooms: dto.bathrooms,
        }),

        ...(dto.furnished !== undefined && {
          furnished: dto.furnished,
        }),

        ...(dto.parkingAvailable !== undefined && {
          parkingAvailable: dto.parkingAvailable,
        }),

        ...(dto.wifiAvailable !== undefined && {
          wifiAvailable: dto.wifiAvailable,
        }),

        ...(dto.petFriendly !== undefined && {
          petFriendly: dto.petFriendly,
        }),

        ...(dto.waterIncluded !== undefined && {
          waterIncluded: dto.waterIncluded,
        }),

        ...(dto.electricityIncluded !== undefined && {
          electricityIncluded: dto.electricityIncluded,
        }),

        ...(dto.noBroker !== undefined && {
          noBroker: dto.noBroker,
        }),

        ...((dto.minPrice !== undefined ||
          dto.maxPrice !== undefined) && {
          monthlyRent: {
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

            {
              area: {
                contains: query,
                mode: 'insensitive',
              },
            },

            {
              ward: {
                contains: query,
                mode: 'insensitive',
              },
            },

            {
              address: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        }),
      },
    },
  };
}