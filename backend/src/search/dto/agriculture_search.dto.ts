<<<<<<< HEAD
import { IsEnum, IsOptional, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import {
  AgricultureListingType,
  UnitType,
  HealthVaccineStatus,
} from '@prisma/client';
=======
import { IsEnum, IsOptional, IsString, IsInt } from "class-validator";
import { Type } from 'class-transformer';
import { AgricultureListingType, UnitType, HealthVaccineStatus } from "@prisma/client";
>>>>>>> origin/aashika

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
<<<<<<< HEAD
  @Type(() => Boolean)
=======
  @Type(() => Boolean)  
>>>>>>> origin/aashika
  organicCertified?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  organicVerified?: boolean;

  @IsOptional()
  @IsEnum(HealthVaccineStatus)
  healthVaccineStatus?: HealthVaccineStatus;

  @IsOptional()
<<<<<<< HEAD
  @Type(() => Number)
=======
  @Type(() => Number)  
>>>>>>> origin/aashika
  @IsInt()
  age?: number;

  @IsOptional()
  search?: string;
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/aashika
