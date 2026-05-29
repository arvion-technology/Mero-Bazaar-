import { IsString, IsBoolean, IsOptional, IsArray, IsNumber, IsInt, ArrayNotEmpty, IsString as IsStringItem } from "class-validator";
import { Type } from "class-transformer";

export class CreateTradesDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  ward?: string;

  @IsArray()
  @ArrayNotEmpty()
  skillTags: string[];

  @IsInt()
  serviceAreaKm: number;

  @IsInt()
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