import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateJobDto } from './dto/create_job.dto';
import { UpdateJobDto } from './dto/update_jobs.dto';
<<<<<<< HEAD
import { ListingCategory } from '@prisma/client';
import { JobSearchDto } from 'src/search/dto/job_search.dto';
import { assertVerifiedSeller } from '../../common/authz/seller-access';
=======
import { QueryJobDto } from './dto/query_job.dto';
import { ListingCategory } from '@prisma/client';
import { JobSearchDto } from 'src/search/dto/job_search.dto';
>>>>>>> origin/aashika

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateJobDto, userId: string) {
<<<<<<< HEAD
    await assertVerifiedSeller(this.prisma, userId);
    return this.prisma.listing.create({
      data: {
        title: `${dto.role} in ${dto.city}`,
        description:
          dto.description?.trim() ||
          `Hiring for ${dto.role} position in ${dto.city}`,
        category: ListingCategory.JOB,
=======
    return this.prisma.listing.create({
      data: {
        title: `${dto.role} in ${dto.city}`,
        description: dto.description?.trim() || `Hiring for ${dto.role} position in ${dto.city}`,        category: ListingCategory.JOB,
>>>>>>> origin/aashika
        images: [],
        user: {
          connect: {
            id: userId,
          },
        },
        job: {
          create: {
            role: dto.role,
            salaryMin: dto.salaryMin,
            salaryMax: dto.salaryMax,
            payPeriod: dto.payPeriod,
            city: dto.city,
<<<<<<< HEAD
            skillTags: dto.skillTags?.map((s) => s.trim()) ?? [],
=======
            skillTags: dto.skillTags?.map(s => s.trim()) ?? [],
>>>>>>> origin/aashika
            contractType: dto.contractType,
            isUrgent: dto.isUrgent ?? false,
          },
        },
      },
      include: {
        job: true,
      },
    });
  }

<<<<<<< HEAD
  async findAll(query: JobSearchDto) {
    return this.prisma.listing.findMany({
      where: {
        category: ListingCategory.JOB,
        job: {
          is: {
            ...(query.query?.trim() && {
              role: { contains: query.query.trim(), mode: 'insensitive' },
            }),
            ...(query.city?.trim() && {
              city: { contains: query.city.trim(), mode: 'insensitive' },
            }),
            ...(query.contractType?.length && {
              contractType: { in: query.contractType },
            }),
            ...(query.isUrgent !== undefined && {
              isUrgent: query.isUrgent,
            }),
            ...(query.skill?.trim() && {
              skillTags: { has: query.skill.trim() },
            }),
            ...(query.minSalary !== undefined && {
              salaryMin: { gte: query.minSalary },
            }),
          },
        },
      },
      include: {
        job: true,
      },
      orderBy: { createdAt: query.sort === 'oldest' ? 'asc' : 'desc' },
      take: query.limit ?? 20,
      skip: ((query.page ?? 1) - 1) * (query.limit ?? 20),
    });
  }
=======
 async findAll(query: JobSearchDto) {
  return this.prisma.listing.findMany({
    where: {
      category: ListingCategory.JOB,
      job: {
        is: {
          ...(query.query?.trim() && {
            role: { contains: query.query.trim(), mode: 'insensitive' },
          }),
          ...(query.city?.trim() && {
            city: { contains: query.city.trim(), mode: 'insensitive' },
          }),
          ...(query.contractType?.length && {
            contractType: { in: query.contractType },
          }),
          ...(query.isUrgent !== undefined && {
            isUrgent: query.isUrgent,
          }),
          ...(query.skill?.trim() && {
            skillTags: { has: query.skill.trim() },
          }),
          ...(query.minSalary !== undefined && {
            salaryMin: { gte: query.minSalary },
          }),
        },
      },
    },
    include: {
      job: true,
    },
    orderBy: { createdAt: query.sort === 'oldest' ? 'asc' : 'desc' },
    take: query.limit ?? 20,
    skip: ((query.page ?? 1) - 1) * (query.limit ?? 20),
  });
}
>>>>>>> origin/aashika

  async findOne(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: { job: true },
    });

    if (!listing || listing.category !== ListingCategory.JOB) {
      throw new NotFoundException('Job listing not found');
    }

    return listing;
  }

<<<<<<< HEAD
  /**
   * Dynamic filter options derived from the live job listings, so the frontend
   * filter sidebar is never hard-coded to stale categories.
   */
  async getFilterOptions() {
    const [types, cities, skillsRows] = await Promise.all([
      this.prisma.job.findMany({
        distinct: ['contractType'],
        select: { contractType: true },
      }),
      this.prisma.job.findMany({
        distinct: ['city'],
        select: { city: true },
        orderBy: { city: 'asc' },
      }),
      this.prisma.job.findMany({
        select: { skillTags: true },
      }),
    ]);

    const skillCounts = new Map<string, number>();
    for (const row of skillsRows) {
      for (const skill of row.skillTags ?? []) {
        skillCounts.set(skill, (skillCounts.get(skill) ?? 0) + 1);
      }
    }
    const topSkills = [...skillCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map(([skill]) => skill);

    return {
      contractTypes: types.map((t) => t.contractType),
      cities: cities.map((c) => c.city),
      skills: topSkills,
    };
  }

=======
>>>>>>> origin/aashika
  async update(id: string, dto: UpdateJobDto, userId: string) {
    await this.findOne(id);

    return this.prisma.listing.update({
      where: { id, userId },
      data: {
<<<<<<< HEAD
        ...(dto.role &&
          dto.city && {
            title: `${dto.role} in ${dto.city}`,
            description: `Hiring for ${dto.role} position in ${dto.city}`,
          }),
=======
        ...(dto.role && dto.city && {
          title: `${dto.role} in ${dto.city}`,
          description: `Hiring for ${dto.role} position in ${dto.city}`,
        }),
>>>>>>> origin/aashika
        job: {
          update: {
            ...(dto.role && { role: dto.role }),
            ...(dto.salaryMin !== undefined && { salaryMin: dto.salaryMin }),
            ...(dto.salaryMax !== undefined && { salaryMax: dto.salaryMax }),
            ...(dto.payPeriod && { payPeriod: dto.payPeriod }),
            ...(dto.city && { city: dto.city }),
<<<<<<< HEAD
            ...(dto.skillTags && {
              skillTags: dto.skillTags.map((s) => s.trim()),
            }),
=======
            ...(dto.skillTags && { skillTags: dto.skillTags.map(s => s.trim()) }),
>>>>>>> origin/aashika
            ...(dto.contractType && { contractType: dto.contractType }),
            ...(dto.isUrgent !== undefined && { isUrgent: dto.isUrgent }),
          },
        },
      },
      include: {
        job: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id);

    return this.prisma.listing.delete({
      where: { id, userId },
    });
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/aashika
