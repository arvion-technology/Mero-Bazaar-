import { IsArray, IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min, IsUrl,  } from "class-validator";
import { BeautyServiceType } from "@prisma/client";
import { Type } from "class-transformer";

export class CreateHairBeautyAndWellnessDto {
  @IsEnum(BeautyServiceType)
  serviceType: BeautyServiceType;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  price: number;

  @IsOptional()
  @IsBoolean()
  priceStartingFrom?: boolean;

  @IsOptional()
  @IsBoolean()
  homeVisit?: boolean;

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