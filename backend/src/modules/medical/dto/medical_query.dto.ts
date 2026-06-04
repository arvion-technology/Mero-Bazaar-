import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class MedicalQueryDto {
  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  specialty?: string;

  @IsOptional()
  @IsString()
  doctorName?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  homeVisitAvailable?: boolean;
}