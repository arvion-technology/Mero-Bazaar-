import { SecondHandCategory, SecondHandCondition } from "@prisma/client";
import { IsEnum, IsInt, IsOptional, IsString, Min, Max } from "class-validator";
import { Type } from "class-transformer";

export class QuerySecondHandDto {
  @IsOptional()
  @IsEnum(SecondHandCategory)
  category?: SecondHandCategory;

  @IsOptional()
  @IsEnum(SecondHandCondition)
  condition?: SecondHandCondition;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxPrice?: number;
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sort?: 'newest' | 'price-low' | 'price-high';

}