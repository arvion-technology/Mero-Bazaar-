import { IsEnum, IsOptional, IsString, IsInt } from "class-validator";
import { Type } from 'class-transformer';
import { AgricultureListingType, UnitType, HealthVaccineStatus } from "@prisma/client";

export class AgricultureSearchDto {
  @IsOptional()
  @IsEnum(AgricultureListingType)
  listingType?: AgricultureListingType;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  village?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxPrice?: number;

  @IsOptional()
  @IsEnum(UnitType)
  unit?: UnitType;

  @IsOptional()
  @Type(() => Boolean)  
  organicCertified?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  organicVerified?: boolean;

  @IsOptional()
  @IsEnum(HealthVaccineStatus)
  healthVaccineStatus?: HealthVaccineStatus;

  @IsOptional()
  @Type(() => Number)  
  @IsInt()
  age?: number;

  @IsOptional()
  search?: string;
}