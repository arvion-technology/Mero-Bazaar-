import { IsBoolean, IsNumber, IsOptional, IsString, IsEnum } from "class-validator";
import { Type } from "class-transformer";
import { ListingType, OwnerType, PropertyType } from "@prisma/client";

export class RentalSearchDto {
  @IsOptional()
  @IsEnum(ListingType)
  listingType?: ListingType;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @IsEnum(PropertyType)
  propertyType?: PropertyType;

  @IsOptional()
  @IsEnum(OwnerType)
  ownerType?: OwnerType;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  area?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  bedrooms?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  bathrooms?: number;

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
  petFriendly?: boolean;

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
  noBroker?: boolean;
}