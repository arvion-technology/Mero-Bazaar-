import { Controller, Delete, Post, Param, Patch, Query, Body, Get, UseGuards, Request, UseInterceptors, UploadedFiles, BadRequestException } from '@nestjs/common';
import { AgricultureService } from './agriculture.service';
import { CreateAgricultureDto } from './dto/create_agriculture.dto';
import { QueryAgricultureDto } from './dto/query_agriculture.dto';
import { UpdateAgricultureDto } from './dto/update_agriculture.dto';
import { JwtAuthGuard } from '../auth/jwt_auth.guards';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('agriculture')
export class AgricultureController {
  constructor(private readonly service: AgricultureService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateAgricultureDto, @Request() req) {
    return this.service.create(dto, req.user.id);
  }

  @Get()
  findAll(@Query() query: QueryAgricultureDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAgricultureDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/photos')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/agriculture',
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