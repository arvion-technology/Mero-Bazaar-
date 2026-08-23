<<<<<<< HEAD
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SecondHandCategory, SecondHandCondition } from '@prisma/client';
=======
import { IsArray, IsBoolean, IsDateString, IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";
import { Type } from "class-transformer";
import { SecondHandCategory, SecondHandCondition } from "@prisma/client";
>>>>>>> origin/aashika

export class CreateSecondHandDto {
  @IsOptional()
  @IsEnum(SecondHandCategory)
  category: SecondHandCategory;
<<<<<<< HEAD

=======
  
>>>>>>> origin/aashika
  @IsOptional()
  @IsEnum(SecondHandCondition)
  condition: SecondHandCondition;

  @IsOptional()
  @IsString()
  itemName: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  price: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isNegotiable?: boolean;

  @IsOptional()
  @IsArray()
  photos: string[];

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  expiresAt: string;
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/aashika
