import { IsString, IsInt, IsEnum, IsBoolean, IsOptional, IsArray } from 'class-validator';
import { PayPeriod, ContractType } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateJobDto {
  @IsString()
  role: string;

  @Type(() => Number)
  @IsInt()
  salaryMin: number;

  @Type(() => Number)
  @IsInt()
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
}
