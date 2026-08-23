<<<<<<< HEAD
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
=======
import { IsOptional, IsString, IsBoolean, IsNumber } from "class-validator";
import { Type } from "class-transformer";
>>>>>>> origin/aashika

export class QueryTradesDto {
  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  skill?: string;

  @IsOptional()
  @Type(() => Boolean)
  emergency?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  km?: number;
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/aashika
