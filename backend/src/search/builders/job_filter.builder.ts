import { Prisma } from "@prisma/client";
import { JobSearchDto } from "../dto/job_search.dto";

export function buildJobFilter(dto: JobSearchDto): Prisma.ListingWhereInput {
  const query = dto.query?.trim();
  const city = dto.city?.trim();

  return {
    job: {
      is: {
        ...(dto.isUrgent !== undefined && {
          isUrgent: dto.isUrgent,
        }),

        ...(city && {
          city: {
            contains: city,
            mode: "insensitive",
          },
        }),

        ...(query && {
          OR: [
            {
              role: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
        }),
      },
    },
  };
}