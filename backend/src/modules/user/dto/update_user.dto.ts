<<<<<<< HEAD
import { IsOptional, IsString } from 'class-validator';
=======
import {  IsOptional, IsString } from "class-validator";
>>>>>>> origin/aashika

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  image?: string;
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/aashika
