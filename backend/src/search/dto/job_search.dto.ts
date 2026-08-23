<<<<<<< HEAD
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsInt,
  IsIn,
  IsEnum,
  IsArray,
  Min,
  Max,
} from 'class-validator';
=======
import { IsOptional, IsString, IsBoolean, IsInt,IsIn, IsEnum, IsArray, Min, Max } from 'class-validator';
>>>>>>> origin/aashika
import { Type, Transform } from 'class-transformer';
import { ContractType } from '@prisma/client';

export class JobSearchDto {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  skill?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minSalary?: number;

  @IsOptional()
<<<<<<< HEAD
  @Transform(({ value }) => {
    if (!value) return undefined;
    return Array.isArray(value) ? value : [value];
  })
=======
  @Transform(({ value }) => {if (!value) return undefined;
    return Array.isArray(value) ? value : [value];})
>>>>>>> origin/aashika
  @IsArray()
  @IsEnum(ContractType, { each: true })
  contractType?: ContractType[];

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isUrgent?: boolean;

  @IsOptional()
  @IsIn(['newest', 'oldest'])
  sort?: 'newest' | 'oldest';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/aashika
