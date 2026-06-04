import { IsOptional, IsEnum, IsNumber, IsBoolean, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { PropertyType, ListingType, OwnerType } from '@prisma/client';

export class QueryRentalDto {
  @IsOptional()
  @IsString()
  @Type(() => String)
  search?: string;

  @IsOptional()
  @IsEnum(PropertyType)
  propertyType?: PropertyType;

  @IsOptional()
  @IsEnum(ListingType)
  listingType?: ListingType;

  @IsOptional()
  @IsEnum(OwnerType)
  ownerType?: OwnerType;

  @IsOptional()
  @IsString()
  @Type(() => String)
  city?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  area?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minRent?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxRent?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  bedrooms?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  bathrooms?: number;

  @IsOptional()
  @IsBoolean()
  furnished?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  petFriendly?: boolean;
}