import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  listingId: string;

  @IsString()
  doctorId: string;

  @IsOptional()
  @IsString()
  patientId?: string;

  @IsString()
  patientName: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsOptional()
  @IsString()
  notes?: string;
}