import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  ParseFloatPipe,
  Patch,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { TradesService } from './trades.service';
import { CreateTradesDto } from './dto/create_trades.dto';
import { QueryTradesDto } from './dto/query_trades.dto';
import { CreateLeadDto } from '../leads/dto/create_lead.dto';
import { UpdateTradesDto } from './dto/update_trades.dto';
import { JwtAuthGuard } from '../auth/jwt_auth.guards';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  imageFileFilter,
  serverFilename,
  removeUploadedFiles,
} from '../../common/uploads/upload.util';

@Controller('trades')
export class TradesController {
  constructor(private readonly tradesService: TradesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateTradesDto, @Request() req) {
    return this.tradesService.create(dto, req.user.id);
  }

  @Get()
  findAll(@Query() query: QueryTradesDto) {
    return this.tradesService.findAll(query);
  }

  @Get('emergency')
  emergency(@Query('city') city?: string) {
    return this.tradesService.emergency(city);
  }

  @Get('nearby')
  nearby(
    @Query('latitude', ParseFloatPipe) latitude: number,
    @Query('longitude', ParseFloatPipe) longitude: number,
    @Query('km', ParseFloatPipe) km: number,
  ) {
    return this.tradesService.nearby(latitude, longitude, km);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/lead')
  createLead(
    @Param('id') id: string,
    @Body() dto: CreateLeadDto,
    @Request() req,
  ) {
    return this.tradesService.createLead(id, dto, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tradesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTradesDto,
    @Request() req,
  ) {
    return this.tradesService.update(id, dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.tradesService.remove(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/photos')
  @UseInterceptors(
    FilesInterceptor('photos', 10, {
      storage: diskStorage({
        destination: './uploads/trades',
        filename: serverFilename,
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
      fileFilter: imageFileFilter,
    }),
  )
  async addPhotos(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req,
  ) {
    try {
      return await this.tradesService.addPhotos(id, files, req.user.id);
    } catch (err) {
      await removeUploadedFiles(files);
      throw err;
    }
  }
}
