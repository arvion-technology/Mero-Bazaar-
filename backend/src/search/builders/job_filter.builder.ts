import { Prisma } from "@prisma/client";
import { JobSearchDto } from "../dto/job_search.dto";

export function buildJobFilter(dto: JobSearchDto): Prisma.ListingWhereInput {
  const query = dto.query?.trim();
  const city = dto.city?.trim();

  return {
    category: 'JOB',

    ...(query && {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { job: { is: { role: { contains: query, mode: 'insensitive' } } } },
        { job: { is: { skillTags: { has: query } } } },
        { job: { is: { city: { contains: query, mode: 'insensitive' } } } },
      ],
    }),

    job: {
      is: {
        ...(dto.isUrgent !== undefined && { isUrgent: dto.isUrgent }),
        ...(city && { city: { contains: city, mode: 'insensitive' } }),
        ...(dto.minSalary && { salaryMin: { gte: dto.minSalary } }),
        ...(dto.skill?.trim() && { skillTags: { has: dto.skill.trim() } }),
        ...(dto.contractType?.length && { contractType: { in: dto.contractType } }),
      },
    },
  };
}