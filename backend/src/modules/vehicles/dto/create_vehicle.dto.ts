import { IsEnum, IsBoolean, IsInt, IsString, Min, IsOptional, IsArray, IsUrl } from "class-validator"; 
import { Type } from "class-transformer";
import { BluebookStatus, FuelType, VehicleCondition, VehicleType } from "src/common/enums/vehicle.enum";

export class CreateVehicleDto {
  @IsEnum(VehicleType)
  type: VehicleType;

  @IsString()
  brand: string;

  @IsString()
  model: string;

  @Type(() => Number)
  @IsInt()
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
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}