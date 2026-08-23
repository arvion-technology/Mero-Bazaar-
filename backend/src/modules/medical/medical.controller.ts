<<<<<<< HEAD
import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  UseGuards,
  Request,
  Delete,
  Patch,
  UseInterceptors,
  BadRequestException,
  UploadedFiles,
} from '@nestjs/common';
=======
import { Controller, Post, Get, Body, Query, Param, ParseUUIDPipe, UseGuards , Request, Delete, Patch, UseInterceptors, BadRequestException, UploadedFiles } from '@nestjs/common';
>>>>>>> origin/aashika
import { MedicalService } from './medical.service';
import { CreateMedicalDto } from './dto/create_medical.dto';
import { MedicalQueryDto } from './dto/medical_query.dto';
import { JwtAuthGuard } from '../auth/jwt_auth.guards';
<<<<<<< HEAD
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  imageFileFilter,
  serverFilename,
  removeUploadedFiles,
} from '../../common/uploads/upload.util';
=======
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
>>>>>>> origin/aashika

@Controller('medical')
export class MedicalController {
  constructor(private readonly medicalService: MedicalService) {}

<<<<<<< HEAD
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR, UserRole.ADMIN)
=======
  @UseGuards(JwtAuthGuard)
>>>>>>> origin/aashika
  @Post()
  create(@Body() dto: CreateMedicalDto, @Request() req) {
    return this.medicalService.create(dto, req.user.id);
  }

  @Get()
  findAll(@Query() query: MedicalQueryDto) {
    return this.medicalService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicalService.findOne(id);
  }

<<<<<<< HEAD
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR, UserRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: CreateMedicalDto,
    @Request() req,
  ) {
    return this.medicalService.update(id, dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR, UserRole.ADMIN)
=======
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: CreateMedicalDto, @Request() req) {
    return this.medicalService.update(id, dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
>>>>>>> origin/aashika
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.medicalService.remove(id, req.user.id);
  }

<<<<<<< HEAD
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR, UserRole.ADMIN)
=======
  @UseGuards(JwtAuthGuard)
>>>>>>> origin/aashika
  @Post(':id/photos')
  @UseInterceptors(
    FilesInterceptor('photos', 10, {
      storage: diskStorage({
        destination: './uploads/medical',
<<<<<<< HEAD
        filename: serverFilename,
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: imageFileFilter,
    }),
  )
  async uploadPhotos(
=======
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
>>>>>>> origin/aashika
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req,
  ) {
    if (!files?.length) {
      throw new BadRequestException('At least one photo is required');
    }
<<<<<<< HEAD
    try {
      return await this.medicalService.addPhotos(id, files, req.user.id);
    } catch (err) {
      await removeUploadedFiles(files);
      throw err;
    }
  }
}
=======
    return this.medicalService.addPhotos(id, files, req.user.id);
  }
}
>>>>>>> origin/aashika
