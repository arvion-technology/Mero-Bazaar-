import { Controller, Delete, Param, Post, Body, Patch, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create_reviews.dto';
import { QueryReviewDto } from './dto/query_review.dto';
import { UpdateReviewDto } from './dto/update_review.dto';
import { JwtAuthGuard } from '../auth/jwt_auth.guards';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateReviewDto, @Request() req) {
    return this.reviewsService.create(dto, req.user.id);
  }

  @Get()
  findAll(@Query() query: QueryReviewDto) {
    return this.reviewsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateReviewDto, @Request() req) {
    return this.reviewsService.update(id, dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.reviewsService.remove(id, req.user.id);
  }
}
