import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsArray,
  IsDateString,
  IsNumber,
  Min,
  MaxLength,
} from 'class-validator';

import { Type } from 'class-transformer';
import { PropertyType, ListingType, OwnerType } from '@prisma/client';

export class CreateRentalDto {
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @IsEnum(ListingType)
  listingType: ListingType;

  @IsString()
  @MaxLength(100)
  city: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  area?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  ward?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  address?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  monthlyRent: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  depositAmount: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bedrooms?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bathrooms?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  squareFeet?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  furnished?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  parkingAvailable?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  wifiAvailable?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  waterIncluded?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  electricityIncluded?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  petFriendly?: boolean;

  @IsOptional()
  @IsDateString()
  availableFrom?: string;

  @IsEnum(OwnerType)
  isOwnerOrAgent: OwnerType;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  noBroker?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  nearbyLandmarks?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  rules?: string[];
}
