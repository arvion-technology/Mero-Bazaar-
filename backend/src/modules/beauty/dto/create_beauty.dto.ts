import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsLatitude,
  IsLongitude,
  Min,
  MaxLength,
} from 'class-validator';
import { BeautyServiceType } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateHairBeautyAndWellnessDto {
  @IsString()
  @MaxLength(200)
  serviceTitle: string;

  @IsEnum(BeautyServiceType)
  serviceType: BeautyServiceType;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  shortDescription?: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  price: number;

  @IsOptional()
  @IsBoolean()
  priceStartingFrom?: boolean;

  @IsOptional()
  @IsString()
  serviceLocationType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  studioLocation?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  location?: string;

  @Type(() => Number)
  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @Type(() => Number)
  @IsOptional()
  @IsLongitude()
  longitude?: number;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsBoolean()
  homeVisit?: boolean;

  @IsOptional()
  @IsString()
  whoIsThisFor?: string;

  @IsOptional()
  @IsString()
  genderPreference?: string;

  @IsOptional()
  @IsString()
  experienceLevel?: string;

  @IsOptional()
  @IsString()
  preparationTime?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  portfolioUrls?: string[];

  @IsOptional()
  @IsBoolean()
  bridalAvailable?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;
}