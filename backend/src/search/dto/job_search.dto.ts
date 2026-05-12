import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class JobSearchDto {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  isUrgent?: boolean;
}