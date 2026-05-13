import {
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
} from "class-validator";

import {
  VehicleType,
  VehicleCondition,
  FuelType,
  BluebookStatus,
  ListingCategory,
} from "@prisma/client";

import { Type } from "class-transformer";

export class SearchListingDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsEnum(VehicleType)
  type?: VehicleType;

  @IsOptional()
  @IsEnum(VehicleCondition)
  condition?: VehicleCondition;

  @IsOptional()
  @IsEnum(BluebookStatus)
  bluebookStatus?: BluebookStatus;

  @IsOptional()
  @IsEnum(FuelType)
  fuelType?: FuelType;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minYear?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxYear?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minKm?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxKm?: number;

  @IsOptional()
  @IsEnum(ListingCategory)
  category?: ListingCategory;
}