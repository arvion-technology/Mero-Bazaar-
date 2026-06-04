import { IsNumber, IsOptional, IsString, IsBoolean, IsArray } from "class-validator";
import { Type } from "class-transformer";

export class TradesSearchDto {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  ward?: string;

  @IsOptional()
  @IsArray()
  skillTags?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxCalloutCharge?: number;

  @IsOptional()
  @Type(() => Boolean)
  emergency?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  warrantyGiven?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  radiusKm?: number;
}