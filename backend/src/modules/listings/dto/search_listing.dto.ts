import { IsOptional, IsString, IsEnum, IsNumber } from "class-validator";
import { Type } from "class-transformer";
import { ListingCategory } from "@prisma/client";

export class SearchListingDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(ListingCategory)
  category?: ListingCategory;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;
}