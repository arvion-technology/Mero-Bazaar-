import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';
import { AgricultureListingType, UnitType, HealthVaccineStatus } from '@prisma/client';

export class CreateAgricultureDto {
  @IsEnum(AgricultureListingType)
  listingType: AgricultureListingType;

  @IsString()
  district: string;

  @IsOptional()
  @IsString()
  village?: string;

  @IsString()
  location: string;

  @Type(() => Number)
  @IsInt()
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
  seasonalAvailability?: string;

  @IsOptional()
  @IsString()
  animalType?: string;

  @IsOptional()
  @IsString()
  breed?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  age?: number;

  @IsOptional()
  @IsEnum(HealthVaccineStatus)
  healthVaccineStatus?: HealthVaccineStatus;
}