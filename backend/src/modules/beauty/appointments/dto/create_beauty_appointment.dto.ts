import { IsOptional, IsString } from "class-validator";

export class CreateBeautyAppointmentDto {
  @IsString()
  listingId: string;

  @IsString()
  slotId: string;

  @IsString()
  customerName: string;

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}