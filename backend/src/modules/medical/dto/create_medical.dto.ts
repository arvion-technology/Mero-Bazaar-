import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  IsEnum,
  ValidateNested,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MedicalServiceType, WeekDay } from '@prisma/client';

export class MedicalSlotInputDto {
  @IsEnum(WeekDay)
  day: WeekDay;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;
}

export class CreateMedicalDto {
  @IsEnum(MedicalServiceType)
  specialty: MedicalServiceType;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  servicesOffered?: string;

  @IsString()
  @MaxLength(150)
  doctorName: string;

  @IsString()
  @MaxLength(50)
  nmcLicenseNumber: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  appointmentFee: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  homeVisitAvailable?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  onlineAppointments?: boolean;

  @IsString()
  @MaxLength(300)
  clinicAddress: string;

  @IsString()
  @MaxLength(100)
  city: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  shortBio?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(100)
  experience?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  slotDurationMinutes?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  bufferMinutes?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  sameDayBooking?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicalSlotInputDto)
  availableSlots?: MedicalSlotInputDto[];

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  latitude?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  longitude?: number;
}
