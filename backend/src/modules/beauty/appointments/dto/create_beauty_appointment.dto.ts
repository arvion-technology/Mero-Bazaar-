import { IsOptional, IsString, Matches } from 'class-validator';

export class CreateBeautyAppointmentDto {
  @IsString()
  listingId: string;

  @IsString()
  slotId: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be YYYY-MM-DD' })
  date: string;

  @IsString()
  customerName: string;

  @IsOptional()
  @IsString()
  notes?: string;
}