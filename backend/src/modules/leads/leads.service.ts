import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateLeadDto } from './dto/create_lead.dto';
import { LeadStatus, ListingCategory } from '@prisma/client';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateLeadDto, userId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: dto.listingId },
      select: { category: true },
    });

    if (!listing) {
      throw new BadRequestException('Listing not found');
    }

    const allowedCategories: ListingCategory[] = [
      ListingCategory.JOB,
      ListingCategory.RENTAL,
      ListingCategory.TRADES,
    ];

    if (!allowedCategories.includes(listing.category)) {
      throw new BadRequestException(
        'Leads are only allowed for JOB, RENTAL, and TRADES categories',
      );
    }

    // prevent duplicate leads
    const existing = await this.prisma.lead.findFirst({
      where: {
        listingId: dto.listingId,
        userId,
        leadType: dto.leadType,
      },
    });

    if (existing) {
      throw new BadRequestException(
        'You already submitted a lead for this listing',
      );
    }

    return this.prisma.lead.create({
      data: {
        listingId: dto.listingId,
        userId,
        leadType: dto.leadType,
        message: dto.message ?? null,
        status: LeadStatus.PENDING,
      },
      include: {
        listing: true,
      },
    });
  }

  async findAll(filters?: {
    category?: ListingCategory;
    status?: LeadStatus;
    userId?: string;
    listingId?: string;
  }) {
    return this.prisma.lead.findMany({
      where: {
        ...(filters?.status && { status: filters.status }),
        ...(filters?.userId && { userId: filters.userId }),
        ...(filters?.listingId && { listingId: filters.listingId }),

        listing: filters?.category
          ? {
              category: filters.category,
            }
          : {
              category: {
                in: [
                  ListingCategory.JOB,
                  ListingCategory.RENTAL,
                  ListingCategory.TRADES,
                ],
              },
            },
      },
      include: {
        listing: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateStatus(id: string, status: LeadStatus) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    return this.prisma.lead.update({
      where: { id },
      data: {
        status,

        ...(status === LeadStatus.VIEWED && {
          contactedAt: new Date(),
        }),

        ...(status === LeadStatus.INTERVIEWED && {
          respondedAt: new Date(),
        }),
      },
      include: {
        listing: true,
      },
    });
  }
}