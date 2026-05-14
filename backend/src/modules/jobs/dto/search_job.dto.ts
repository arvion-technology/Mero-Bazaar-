import { IsOptional, IsString, IsBoolean, IsEnum } from "class-validator";
import { Type } from 'class-transformer';
import { ContractType } from "@prisma/client";

export class JobSearchDto {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isUrgent?: boolean;

  @IsOptional()
  @IsEnum(ContractType)
  contractType?: ContractType;
}