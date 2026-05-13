import { Prisma } from "@prisma/client";
import { JobSearchDto } from "src/search/dto/job_search.dto";

export function buildJobFilter(dto: JobSearchDto): Prisma.JobWhereInput {
    const where: Prisma.JobWhereInput = {};

    if (dto.query?.trim()) {
      where.role = {
        contains: dto.query.trim(),
        mode: 'insensitive',
      };
    }

    if (dto.city?.trim()) {
        where.city = {
            contains: dto.city.trim(),
            mode: 'insensitive',
        };
    }

    if (dto.isUrgent !== undefined) {
      where.isUrgent = dto.isUrgent;
    }

    return where;
}