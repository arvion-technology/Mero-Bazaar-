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
  start_time: string;

  @IsDateString()
  end_time: string;

  @IsOptional()
  @IsString()
  notes?: string;
}