import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateJobDto } from './dto/create_job.dto';
import { UpdateJobDto } from './dto/update_jobs.dto';
import { QueryJobDto } from './dto/query_job.dto';
import { ListingCategory } from '@prisma/client';
import { JobSearchDto } from 'src/search/dto/job_search.dto';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateJobDto, userId: string) {
    return this.prisma.listing.create({
      data: {
        title: `${dto.role} in ${dto.city}`,
        description: `Hiring for ${dto.role} position in ${dto.city}`,
        category: ListingCategory.JOB,
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
            skillTags: dto.skillTags?.map(s => s.trim()) ?? [],
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

  async update(id: string, dto: UpdateJobDto, userId: string) {
    await this.findOne(id);

    return this.prisma.listing.update({
      where: { id, userId },
      data: {
        ...(dto.role && dto.city && {
          title: `${dto.role} in ${dto.city}`,
          description: `Hiring for ${dto.role} position in ${dto.city}`,
        }),
        job: {
          update: {
            ...(dto.role && { role: dto.role }),
            ...(dto.salaryMin !== undefined && { salaryMin: dto.salaryMin }),
            ...(dto.salaryMax !== undefined && { salaryMax: dto.salaryMax }),
            ...(dto.payPeriod && { payPeriod: dto.payPeriod }),
            ...(dto.city && { city: dto.city }),
            ...(dto.skillTags && { skillTags: dto.skillTags.map(s => s.trim()) }),
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
}