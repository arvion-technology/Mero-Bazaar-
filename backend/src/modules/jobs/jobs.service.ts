import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateJobDto } from './dto/create_job.dto';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async create(listingId: string, dto: CreateJobDto) {
    return this.prisma.job.create({
      data: {
        listingId,
        ...dto,
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