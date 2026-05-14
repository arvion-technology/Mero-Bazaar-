import { IsOptional, IsEnum, IsString, IsNumber } from "class-validator";
import { Type } from "class-transformer";
import { VehicleType, FuelType, VehicleCondition } from "src/common/enums/vehicle.enum";
import { BluebookStatus } from "@prisma/client";

export class VehicleSearchDto {
  @IsOptional()
  @IsString()
  title?: string;

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

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @IsEnum(VehicleCondition)
  condition?: VehicleCondition;

  @IsOptional()
  @IsEnum(FuelType)
  fuelType?: FuelType;

  @IsOptional()
  @IsEnum(BluebookStatus)
  bluebookStatus?: BluebookStatus;
}