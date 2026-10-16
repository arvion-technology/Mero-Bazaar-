import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsLatitude,
  IsLongitude,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';
import { BeautyServiceType, WeekDay } from '@prisma/client';
import { Type } from 'class-transformer';

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

export class AvailabilitySlotDto {
  @IsEnum(WeekDay)
  day: WeekDay;

  @Matches(HHMM, { message: 'startTime must be HH:mm (24h), e.g. 09:30' })
  startTime: string;

  @Matches(HHMM, { message: 'endTime must be HH:mm (24h), e.g. 17:00' })
  endTime: string;
}

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
  location?: string;

  @Type(() => Number)
  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @Type(() => Number)
  @IsOptional()
  @IsLongitude()
  longitude?: number;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(15)
  durationMinutes?: number;

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

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(200)
  @ValidateNested({ each: true })
  @Type(() => AvailabilitySlotDto)
  availability?: AvailabilitySlotDto[];
}