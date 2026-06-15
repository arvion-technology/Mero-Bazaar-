import { IsOptional, IsString, IsEnum, IsInt, Min, IsBoolean } from 'class-validator';
import { ContractType } from '@prisma/client';
import { Type } from 'class-transformer';

export class QueryJobDto {
  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsEnum(ContractType)
  contractType?: ContractType;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isUrgent?: boolean;

    @IsOptional()
  @IsString()
  skill?: string;      

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minSalary?: number;       
}