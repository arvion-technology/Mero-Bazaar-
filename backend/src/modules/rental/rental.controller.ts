import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Body,
  Query,
  Patch,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  imageFileFilter,
  serverFilename,
  removeUploadedFiles,
} from '../../common/uploads/upload.utils';
import { RentalService } from './rental.service';
import { CreateRentalDto } from './dto/create_rental.dto';
import { QueryRentalDto } from './dto/query_rental.dto';
import { UpdateRentalDto } from './dto/update_rental.dto';
import { JwtAuthGuard } from '../auth/jwt_auth.guards';

@Controller('rental')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateRentalDto, @Request() req) {
    return this.rentalService.create(dto, req.user.id);
  }

  @Get()
  findAll(@Query() query: QueryRentalDto) {
    return this.rentalService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rentalService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateRentalDto,
    @Request() req,
  ) {
    return this.rentalService.update(id, dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/photos')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/rental',
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
      return await this.rentalService.addPhotos(id, files, req.user.id);
    } catch (err) {
      await removeUploadedFiles(files);
      throw err;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.rentalService.remove(id, req.user.id);
  }
}
