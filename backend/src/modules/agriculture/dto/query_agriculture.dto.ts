import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AgricultureListingType, UnitType } from '@prisma/client';

export class QueryAgricultureDto {
  @IsOptional()
  @IsEnum(AgricultureListingType)
  listingType?: AgricultureListingType;

  @IsOptional()
  @IsEnum(UnitType)
  unit?: UnitType;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  search?: string;
}