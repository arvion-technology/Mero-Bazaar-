import { IsOptional, IsString, IsEnum, IsNumber } from "class-validator";
import { Type } from "class-transformer";
import { VehicleType, VehicleCondition, FuelType } from "@prisma/client";

export class VehicleSearchDto {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsEnum(VehicleType)
  type?: VehicleType;

  @IsOptional()
  @IsEnum(VehicleCondition)
  condition?: VehicleCondition;

  @IsOptional()
  @IsEnum(FuelType)
  fuelType?: FuelType;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minYear?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxYear?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minKm?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxKm?: number;
}