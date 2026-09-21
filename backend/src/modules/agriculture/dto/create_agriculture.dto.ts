import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsArray,
  Min,
  MaxLength,
} from 'class-validator';
import {
  AgricultureListingType,
  UnitType,
  HealthVaccineStatus,
  VetServiceType,
  WeekDay,
} from '@prisma/client';

export class CreateAgricultureDto {
  @IsEnum(AgricultureListingType)
  listingType: AgricultureListingType;

  @IsString()
  @MaxLength(100)
  district: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  village?: string;

  @IsString()
  @MaxLength(300)
  location: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  pricePerUnit: number;

  @IsEnum(UnitType)
  unit: UnitType;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  organicCertified?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  organicVerified?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  seasonalAvailability?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  animalType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  breed?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  age?: number;

  @IsOptional()
  @IsEnum(HealthVaccineStatus)
  healthVaccineStatus?: HealthVaccineStatus;

  @IsOptional()
  @IsEnum(VetServiceType)
  vetServiceType?: VetServiceType;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  experienceYears?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  mobileService?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  vaccinationAvailable?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  serviceRadiusKm?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  healthCertificate?: boolean;

  @IsOptional()
  @IsArray()
  @IsEnum(WeekDay, { each: true })
  availabilityDays?: WeekDay[];
}
