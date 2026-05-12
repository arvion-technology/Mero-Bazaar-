import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { SearchStrategy } from "./search.strategy.interface";
import { JobSearchDto } from "../dto/job_search.dto";

@Injectable()
export class JobStrategy implements SearchStrategy {
  constructor(private prisma: PrismaService) {}

  async search(filters: JobSearchDto) {
    return this.prisma.job.findMany({
      where: {
        ...(filters.query && {
          role: {
            contains: filters.query,
            mode: 'insensitive',
          },
        }),

        ...(filters.city && {
          city: filters.city,
        }),

        ...(filters.isUrgent !== undefined && {
          isUrgent: filters.isUrgent,
        }),
      },
    });
  }
}