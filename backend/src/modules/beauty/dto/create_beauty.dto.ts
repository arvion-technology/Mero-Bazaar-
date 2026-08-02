import { IsArray, IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";
import { BeautyServiceType } from "@prisma/client";
import { Type } from "class-transformer";

export class CreateHairBeautyAndWellnessDto {
  @IsString()
  serviceTitle: string;

  @IsEnum(BeautyServiceType)
  serviceType: BeautyServiceType;

  @IsOptional()
  @IsString()
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
  studioLocation?: string;

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
  city?: string;
}