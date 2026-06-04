import { IsOptional, IsString } from "class-validator";

export class CreateMedicalAppointmentDto {
  @IsString()
  listingId: string;

  @IsString()
  slotId: string;

  @IsString()
  patientName: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
