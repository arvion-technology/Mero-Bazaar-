import { Controller, Post, Param, Patch, Delete, Get, Body, Query, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { SecondhandService } from './secondhand.service';
import { CreateSecondHandDto } from './dto/create_secondhand.dto';
import { QuerySecondHandDto } from './dto/query_secondhand.dto';
import { UpdateSecondHandDto } from './dto/update_secondhand.dto';
import { JwtAuthGuard } from '../auth/jwt_auth.guards';
import { UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('secondhand-goods')
export class SecondhandController {
  constructor(private readonly service: SecondhandService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateSecondHandDto, @Request() req) {
    return this.service.create(dto, req.user.id);
  }

  @Get()
  findAll(@Query() query: QuerySecondHandDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSecondHandDto, @Request() req) {
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
        destination: './uploads/secondhand-goods',
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
    return this.service.savePhotos(id, files, req.user.id);
  }
}
