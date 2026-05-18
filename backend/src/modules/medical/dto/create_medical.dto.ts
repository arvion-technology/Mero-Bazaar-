import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMedicalDto {
  @IsString()
  doctorName: string;

  @IsString()
  specialty: string;

  @IsString()
  nmcLicenseNumber: string;

  @IsNumber()
  @Type(() => Number)
  appointmentFee: number;

  @IsObject()
  availableSlots: Record<string, string[]>;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  homeVisitAvailable?: boolean;

  @IsString()
  clinicAddress: string;

  @IsString()
  city: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  latitude?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  longitude?: number;
}