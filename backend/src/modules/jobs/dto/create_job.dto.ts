import { IsString, IsInt, IsEnum, IsBoolean, IsOptional, IsArray, Min, Max } from 'class-validator';
import { PayPeriod, ContractType } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateJobDto {
  @IsString()
  role: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  salaryMin: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100000000)
  salaryMax: number;

  @IsEnum(PayPeriod)
  payPeriod: PayPeriod;

  @IsString()
  city: string;

  @IsArray()
  @IsOptional()
  skillTags?: string[];

  @IsEnum(ContractType)
  contractType: ContractType;

  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isUrgent?: boolean;

  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  employerPhoneVerified?: boolean;
}
