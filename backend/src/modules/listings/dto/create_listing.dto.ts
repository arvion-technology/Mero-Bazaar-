import { IsArray, IsEnum, IsNumber, ValidateNested, IsOptional, IsString } from "class-validator";
import { CreateVehicleDto } from "src/modules/vehicles/dto/vehicle.dto";
import { Type } from 'class-transformer';
import { ListingCategory } from '@prisma/client';

export class CreateListingDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  price?: number;

  @IsEnum(ListingCategory)
  category: ListingCategory;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateVehicleDto)
  vehicle?: CreateVehicleDto;
}