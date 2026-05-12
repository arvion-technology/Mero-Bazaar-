import { IsEnum, IsBoolean, IsInt, IsNumber, IsString, Min, IsOptional } from "class-validator";
import { BluebookStatus, FuelType, VehicleCondition, VehicleType } from "src/common/enums/vehicle.enum";

export class CreateVehicleDto {
  @IsEnum(VehicleType)
  type: VehicleType;

  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsInt()
  year: number;

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
  @IsBoolean()
  ownership_transfer_ready?: boolean;

  @IsNumber()
  price: number;
}