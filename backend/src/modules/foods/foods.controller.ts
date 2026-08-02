import { Controller, Delete, Param, Patch, Get, Body, Query, Post, UseGuards, Request, UseInterceptors, UploadedFiles, BadRequestException } from '@nestjs/common';
import { CreateFoodsAndHomeDeliveryDto } from './dto/create_foods.dto';
import { QueryFoodsAndHomeDeliveryDto } from './dto/query_foods.dto';
import { UpdateFoodsAndHomeDeliveryDto } from './dto/update_foods.dto';
import { FoodsService } from './foods.service';
import { JwtAuthGuard } from '../auth/jwt_auth.guards';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('foods')
export class FoodsController {
  constructor(private readonly service: FoodsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateFoodsAndHomeDeliveryDto, @Request() req) {
    return this.service.create(dto, req.user.id);
  }

  @Get()
  findAll(@Query() query: QueryFoodsAndHomeDeliveryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFoodsAndHomeDeliveryDto, @Request() req) {
    return this.service.update(id, dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.service.remove(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/photos')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/foods',
        filename: (req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new BadRequestException('Only image files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  uploadPhotos(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req,
  ) {
    if (!files?.length) {
      throw new BadRequestException('At least one photo is required');
    }
    return this.service.addPhotos(id, files, req.user.id);
  }
}