import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateSecondHandDto } from './dto/create_secondhand.dto';
import { ListingCategory, ListingStatus, SecondHandCategory, SecondHandCondition } from '@prisma/client';
import { QuerySecondHandDto } from './dto/query_secondhand.dto';
import { UpdateSecondHandDto } from './dto/update_secondhand.dto';

@Injectable()
export class SecondhandService {
  constructor(private prisma: PrismaService) {}
  
    async create(dto: CreateSecondHandDto, userId: string) {
      return this.prisma.listing.create({
        data: {
          title: dto.itemName,
          category: ListingCategory.SECONDHAND,
          description: dto.description,
          price: dto.price,
          images: dto.photos,
          user: {
            connect: {
              id: userId,
            },
          },
          secondhand: {
            create: {
                category: dto.category,
                condition: dto.condition,
                itemName: dto.itemName,
                price: dto.price,
                isNegotiable: dto.isNegotiable ?? false,
                photos: dto.photos,
                city: dto.city,
                description: dto.description,
                expiresAt: new Date(dto.expiresAt),
                status: ListingStatus.ACTIVE,
            },
          },
        },
        include: {
          secondhand: true,
        },
      });
    }

    async findAll(query: QuerySecondHandDto) {
      return this.prisma.listing.findMany({
        where: {
            category: ListingCategory.SECONDHAND,
            secondhand: {
              is: {
                ...(query.category && { category: query.category }),
                ...(query.condition && { condition: query.condition }),
                ...(query.city && { city: query.city }),
                ...(query.minPrice || query.maxPrice 
                  ?{
                    price: {
                      gte: query.minPrice,
                      lte: query.maxPrice,
                    },
                  }
                  : {}),
              },
            },
        },
        include: {
          secondhand:true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    async findOne(id: string) {
      const listing = await this.prisma.listing.findUnique({
        where: { id },
        include: {
          secondhand:true,
        },
      });
      if (!listing || listing.category !== ListingCategory.SECONDHAND) {
        throw new ForbiddenException('Secondhand listing not found');
      }
      return listing;
    }

    async update(id: string, dto: UpdateSecondHandDto, userId: string) {
      const listing = await this.prisma.listing.findUnique({
        where: { id },
      });

      if (!listing || listing.userId !== userId) {
        throw new ForbiddenException('Unauthorized');
      }

      return this.prisma.listing.update({
        where: { id },
        data: {
          title: dto.itemName,
          description: dto.description,
          price: dto.price,
          images: dto.photos,

          secondhand: {
            update: {
              category: dto.category,
              condition: dto.condition,
              itemName: dto.itemName,
              price: dto.price,
              isNegotiable: dto.isNegotiable,
              photos: dto.photos,
              city: dto.city,
              description: dto.description,
              ...(dto.expiresAt && {
                expiresAt: new Date(dto.expiresAt),
              }),
            },
          },
        },
        include: {
          secondhand: true,
        },
      });
    }
    async remove(id: string, userId: string) {
      const listing = await this.prisma.listing.findUnique({
        where: { id },
      });

      if (!listing || listing.userId !== userId) {
        throw new ForbiddenException('Unauthorized');
      }

      return this.prisma.listing.delete({
        where: { id },
      });
    }
}