import {
  Controller,
  Delete,
  Param,
  Patch,
  Get,
  Post,
  Body,
  Request,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  imageFileFilter,
  serverFilename,
  removeUploadedFiles,
} from '../../common/uploads/upload.utils';
import { HairBeautyAndWellnessService } from './beauty.service';
import { CreateHairBeautyAndWellnessDto } from './dto/create_beauty.dto';
import { UpdateHairBeautyAndWellnessDto } from './dto/update_beauty.dto';
import { SellerOnly } from '../auth/roles_access.decorator';

@Controller('beauty')
export class HairBeautyAndWellnessController {
  constructor(private readonly beautyService: HairBeautyAndWellnessService) {}

  @SellerOnly()
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

  @SellerOnly()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateHairBeautyAndWellnessDto,
    @Request() req,
  ) {
    return this.beautyService.update(id, dto, req.user.id);
  }

  @SellerOnly()
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.beautyService.remove(id, req.user.id);
  }

  @SellerOnly()
  @Post(':id/photos')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/beauty',
        filename: serverFilename,
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: imageFileFilter,
    }),
  )
  async addPhotos(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req,
  ) {
    try {
      return await this.beautyService.addPhotos(id, files, req.user.id);
    } catch (err) {
      await removeUploadedFiles(files);
      throw err;
    }
  }
}
