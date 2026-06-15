import { IsOptional, IsString, IsBoolean, IsNumber } from "class-validator";
import { Type } from "class-transformer";

export class MedicalSearchDto {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  specialty?: string;

  @IsOptional()
  @Type(() => Boolean)
  isVerified?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  homeVisitAvailable?: boolean;

  @IsOptional()
  @Type(() => Number)
  minFee?: number;

  @IsOptional()
  @Type(() => Number)
  maxFee?: number;
}