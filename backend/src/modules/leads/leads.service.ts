import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateLeadDto } from './dto/create_lead.dto';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateLeadDto) {
    return this.prisma.lead.create({
        data: {
            listingId: dto.listingId,
            leadType: dto.leadType,
        },
    });
  }

  async findAll() {
    return this.prisma.lead.findMany({
      include: {
        listing: true,
      },
    });
  }
}
