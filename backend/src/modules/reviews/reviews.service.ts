import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateReviewDto } from './dto/create_reviews.dto';
import { QueryReviewDto } from './dto/query_review.dto';
import { UpdateReviewDto } from './dto/update_review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateReviewDto, userId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: dto.listingId },
      select: { userId: true },
    });

    if (listing?.userId === userId) {
      throw new ForbiddenException("You can't review your own listing");
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    return this.prisma.review.create({
      data: {
        userId,
        listingId: dto.listingId,
        reviewerName: user?.name ?? "Anonymous",
        rating: dto.rating,
        comment: dto.comment,
      },
    });
  }

  async findAll(query: QueryReviewDto) {
    const {listingId, minRating, maxRating, page=1, limit=10, search }=query;
    const where: any = {};

    if (listingId) {
      where.listingId = listingId;
    }
    if (minRating !== undefined || maxRating !== undefined ) {
      where.rating = {
        ...(minRating !== undefined ? { gte: Number(minRating) } : {}),
        ...(maxRating !== undefined ? { lte: Number(maxRating) } : {}),
      };
    }
    if (search) {
        where.OR = [
        { comment: { contains: search, mode: 'insensitive' } },
        { reviewerName: { contains: search, mode: 'insensitive' } },
        ];
    }
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    return this.prisma.review.findMany({
      where,
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.review.findUnique({
      where: { id },
    });
}

  async update(id: string, dto: UpdateReviewDto, userId: string) {
    return this.prisma.review.update({
      where: { id, userId },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    return this.prisma.review.delete({
      where: { id, userId },
    });
  }
}
 