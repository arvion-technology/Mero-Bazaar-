<<<<<<< HEAD
import {
  ConflictException,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
=======
import { Injectable, ForbiddenException } from '@nestjs/common';
>>>>>>> origin/aashika
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

<<<<<<< HEAD
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.userId === userId) {
      throw new ForbiddenException("You can't review your own listing");
    }

    // One review per user per listing (enforced by a DB unique constraint too).
    const existing = await this.prisma.review.findUnique({
      where: { userId_listingId: { userId, listingId: dto.listingId } },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException('You have already reviewed this listing');
    }

=======
    if (listing?.userId === userId) {
      throw new ForbiddenException("You can't review your own listing");
    }

>>>>>>> origin/aashika
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

<<<<<<< HEAD
    try {
      return await this.prisma.review.create({
        data: {
          userId,
          listingId: dto.listingId,
          reviewerName: user?.name ?? 'Anonymous',
          rating: dto.rating,
          comment: dto.comment,
        },
      });
    } catch (err) {
      if (err?.code === 'P2002') {
        throw new ConflictException('You have already reviewed this listing');
      }
      throw err;
    }
  }

  async findAll(query: QueryReviewDto) {
    const {
      listingId,
      minRating,
      maxRating,
      page = 1,
      limit = 10,
      search,
    } = query;
=======
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
>>>>>>> origin/aashika
    const where: any = {};

    if (listingId) {
      where.listingId = listingId;
    }
<<<<<<< HEAD
    if (minRating !== undefined || maxRating !== undefined) {
=======
    if (minRating !== undefined || maxRating !== undefined ) {
>>>>>>> origin/aashika
      where.rating = {
        ...(minRating !== undefined ? { gte: Number(minRating) } : {}),
        ...(maxRating !== undefined ? { lte: Number(maxRating) } : {}),
      };
    }
    if (search) {
<<<<<<< HEAD
      where.OR = [
        { comment: { contains: search, mode: 'insensitive' } },
        { reviewerName: { contains: search, mode: 'insensitive' } },
      ];
=======
        where.OR = [
        { comment: { contains: search, mode: 'insensitive' } },
        { reviewerName: { contains: search, mode: 'insensitive' } },
        ];
>>>>>>> origin/aashika
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
<<<<<<< HEAD
  }
=======
}
>>>>>>> origin/aashika

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
<<<<<<< HEAD
=======
 
>>>>>>> origin/aashika
