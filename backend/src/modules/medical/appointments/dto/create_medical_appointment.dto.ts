<<<<<<< HEAD
import { IsOptional, IsString } from 'class-validator';
=======
import { IsOptional, IsString } from "class-validator";
>>>>>>> origin/aashika

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
