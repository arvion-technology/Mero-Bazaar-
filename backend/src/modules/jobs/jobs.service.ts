import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateJobDto } from './dto/create_job.dto';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async create(listingId: string, dto: CreateJobDto) {

    if (dto.salaryMin > dto.salaryMax) {
      throw new BadRequestException('Minimum salary cannot be greater than maximum salary!')
    }
    return this.prisma.job.create({
      data: {
        listingId,
        role: dto.role.trim(),
        salaryMin: Number(dto.salaryMin),
        salaryMax: Number(dto.salaryMax),
        payPeriod: dto.payPeriod,
        city: dto.city.trim(),
        skillTags: dto.skillTags ?? [],
        contractType: dto.contractType,
        isUrgent: dto.isUrgent ?? false,
      },
    });
  }

  async findAll() {
    return this.prisma.job.findMany({
      include: { listing: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.job.findUnique({
      where: { id },
      include: { listing: true },
    });
  }
}