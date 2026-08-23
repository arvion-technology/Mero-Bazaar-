<<<<<<< HEAD
﻿import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { Type } from 'class-transformer';
import { ListingCategory } from '@prisma/client';
=======
import {
  IsArray,
  IsEnum,
  IsNumber,
  ValidateNested,
  IsOptional,
  IsString,
} from "class-validator";

import { CreateVehicleDto } from "src/modules/vehicles/dto/create_vehicle.dto";
import { Type } from "class-transformer";
import { ListingCategory } from "@prisma/client";
>>>>>>> origin/aashika

export class CreateListingDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  price?: number;

  @IsEnum(ListingCategory)
  category: ListingCategory;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/aashika
