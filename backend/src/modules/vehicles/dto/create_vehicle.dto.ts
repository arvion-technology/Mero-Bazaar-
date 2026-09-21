import {
  IsEnum,
  IsBoolean,
  IsInt,
  IsString,
  Min,
  IsNumber,
  IsOptional,
  IsArray,
  IsObject,
  MaxLength,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  BluebookStatus,
  FuelType,
  VehicleCondition,
  VehicleType,
} from 'src/common/enums/vehicle.enum';

export class CreateVehicleDto {
  @IsEnum(VehicleType)
  type: VehicleType;

  @IsString()
  @MaxLength(100)
  brand: string;

  @IsString()
  @MaxLength(100)
  model: string;

  @Type(() => Number)
  @IsInt()
  @Min(1900)
  @Max(2100)
  year: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  km_driven: number;

  @IsEnum(VehicleCondition)
  condition: VehicleCondition;

  @IsEnum(BluebookStatus)
  bluebook_status: BluebookStatus;

  @IsOptional()
  @IsEnum(FuelType)
  fuel_type?: FuelType;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  ownership_transfer_ready?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  address?: string;

  @IsOptional()
  @IsObject()
  details: Record<string, any>;
}
