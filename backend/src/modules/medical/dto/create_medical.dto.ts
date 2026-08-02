import { IsString, IsNumber, IsBoolean, IsOptional, IsArray, IsEnum, ValidateNested } from 'class-validator';
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
  servicesOffered?: string;

  @IsString()
  doctorName: string;

  @IsString()
  nmcLicenseNumber: string;

  @IsNumber()
  @Type(() => Number)
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
  clinicAddress: string;

  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  shortBio?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @IsString()
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