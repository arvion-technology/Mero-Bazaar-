import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { SearchStrategy } from "./search.strategy.interface";
import { JobSearchDto } from "../dto/job_search.dto";
import { buildJobFilter } from "../builders/job-filter.builder";

@Injectable()
export class JobStrategy implements SearchStrategy {
  constructor(private prisma: PrismaService) {}

  async search(filters: JobSearchDto) {
    return this.prisma.job.findMany({
      where: buildJobFilter(filters),
      include: {
        listing: true,
      },
    });
  }
}