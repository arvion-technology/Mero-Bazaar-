import { Type, Transform } from "class-transformer";
import { IsOptional, IsString, IsEnum, IsBoolean, IsInt, Min } from "class-validator";
import { SecondHandCategory, SecondHandCondition, ListingStatus } from "@prisma/client";

export class SecondHandSearchDto {
  @IsOptional()
  @IsString()
  search?: string;

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
  @IsEnum(SecondHandCategory)
  category?: SecondHandCategory;

  @IsOptional()
  @IsEnum(SecondHandCondition)
  condition?: SecondHandCondition;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isNegotiable?: boolean;

  @IsOptional()
  @IsEnum(ListingStatus)
  status?: ListingStatus;
}