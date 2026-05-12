import { IsString, IsInt, IsEnum, IsBoolean, IsOptional, IsArray } from 'class-validator';
import { PayPeriod, ContractType } from '@prisma/client';

export class CreateJobDto {
  @IsString()
  role: string;

  @IsInt()
  salaryMin: number;

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

  @IsBoolean()
  @IsOptional()
  isUrgent?: boolean;
}