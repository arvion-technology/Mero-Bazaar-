<<<<<<< HEAD
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  IsArray,
} from 'class-validator';
=======
import { IsOptional, IsString, IsBoolean, IsNumber, IsArray } from 'class-validator';
>>>>>>> origin/aashika
import { Type } from 'class-transformer';

export class UpdateTradesDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsArray()
  skillTags?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  serviceAreaKm?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  calloutCharge?: number;

  @IsOptional()
  @IsBoolean()
  emergencyAvailable?: boolean;

  @IsOptional()
  @IsBoolean()
  warrantyGiven?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  avgResponseHours?: number;
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/aashika
