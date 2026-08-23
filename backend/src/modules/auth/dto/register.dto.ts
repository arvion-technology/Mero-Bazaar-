<<<<<<< HEAD
import { UserRole } from '@prisma/client';
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsIn,
} from 'class-validator';
=======
import { UserRole } from "@prisma/client";
import { IsEmail, IsEnum, IsOptional, IsString, MinLength, IsIn } from "class-validator";
>>>>>>> origin/aashika

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsIn([UserRole.USER, UserRole.VENDOR])
  role?: UserRole;

  @IsOptional()
  @IsString()
  address?: string;
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/aashika
