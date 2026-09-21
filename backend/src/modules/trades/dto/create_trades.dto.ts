import {
  IsString,
  IsBoolean,
  IsOptional,
  IsArray,
  IsNumber,
  IsInt,
  ArrayNotEmpty,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTradesDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @IsString()
  @MaxLength(100)
  city: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  ward?: string;

  @IsArray()
  @ArrayNotEmpty()
  skillTags: string[];

  @IsInt()
  @Min(0)
  serviceAreaKm: number;

  @IsInt()
  @Min(0)
  calloutCharge: number;

  @IsBoolean()
  emergencyAvailable: boolean;

  @IsBoolean()
  warrantyGiven: boolean;

  @Type(() => Number)
  @IsNumber()
  latitude: number;

  @Type(() => Number)
  @IsNumber()
  longitude: number;
}
