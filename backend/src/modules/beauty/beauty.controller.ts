import { Controller, Delete, Param, Patch, Get, Post, Body, UseGuards, Request, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { HairBeautyAndWellnessService } from './beauty.service';
import { CreateHairBeautyAndWellnessDto } from './dto/create_beauty.dto';
import { UpdateHairBeautyAndWellnessDto } from './dto/update_beauty.dto';
import { JwtAuthGuard } from '../auth/jwt_auth.guards';

@Controller('beauty')
export class HairBeautyAndWellnessController {
  constructor(private readonly beautyService: HairBeautyAndWellnessService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateHairBeautyAndWellnessDto, @Request() req) {
    return this.beautyService.create(dto, req.user.id);
  }

  @Get()
  findAll() {
    return this.beautyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.beautyService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateHairBeautyAndWellnessDto, @Request() req) {
    return this.beautyService.update(id, dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.beautyService.remove(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/photos')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/beauty',
        filename: (req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(new Error('Only JPG/PNG images allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  addPhotos(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req,
  ) {
    return this.beautyService.addPhotos(id, files, req.user.id);
  }
}