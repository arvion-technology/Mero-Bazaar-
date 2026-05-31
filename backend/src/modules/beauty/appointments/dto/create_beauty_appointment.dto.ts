import { IsDateString, IsOptional, IsString } from "class-validator";

export class CreateBeautyAppointmentDto {
  @IsString()
  beautyId: string;

  @IsString()
  slotId: string;

  @IsString()
  customerName: string;

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsOptional()
  @IsString()
  notes?: string;
}