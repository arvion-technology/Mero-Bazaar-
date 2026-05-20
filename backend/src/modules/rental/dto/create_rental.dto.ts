import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsArray,
  IsDateString,
  IsNumber,
} from 'class-validator';

import { Type } from 'class-transformer';
import { PropertyType, ListingType, OwnerType } from '@prisma/client';

export class CreateRentalDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
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
  city: string;

  @IsOptional()
  @IsString()
  area?: string;

  @IsOptional()
  @IsString()
  ward?: string;

  @IsOptional()
  @IsString()
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
  monthlyRent: number;

  @Type(() => Number)
  @IsNumber()
  depositAmount: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  bedrooms?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  bathrooms?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
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