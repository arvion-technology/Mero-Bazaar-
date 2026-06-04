import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min, Max } from "class-validator";
import { BeautyServiceType } from "@prisma/client";
import { Type, Transform } from "class-transformer";

export class BeautySearchDto {
  @IsOptional()
  @IsEnum(BeautyServiceType)
  serviceType?: BeautyServiceType;

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
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  homeVisit?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  bridalAvailable?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  priceStartingFrom?: boolean;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  search?: string;
}