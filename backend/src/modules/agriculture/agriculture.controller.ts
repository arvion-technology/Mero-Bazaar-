import {
  Controller,
  Delete,
  Post,
  Param,
  Patch,
  Query,
  Body,
  Get,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { AgricultureService } from './agriculture.service';
import { CreateAgricultureDto } from './dto/create_agriculture.dto';
import { QueryAgricultureDto } from './dto/query_agriculture.dto';
import { UpdateAgricultureDto } from './dto/update_agriculture.dto';
import { JwtAuthGuard } from '../auth/jwt_auth.guards';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  imageFileFilter,
  serverFilename,
  removeUploadedFiles,
} from '../../common/uploads/upload.util';

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
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAgricultureDto,
    @Request() req,
  ) {
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
        destination: './uploads/agriculture',
        filename: serverFilename,
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: imageFileFilter,
    }),
  )
  async uploadPhotos(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req,
  ) {
    if (!files?.length) {
      throw new BadRequestException('At least one photo is required');
    }
    try {
      return await this.service.addPhotos(id, files, req.user.id);
    } catch (err) {
      // Multer already wrote the temp files: never leave orphans behind on authz failure.
      await removeUploadedFiles(files);
      throw err;
    }
  }
}
