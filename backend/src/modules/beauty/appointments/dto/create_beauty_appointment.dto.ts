<<<<<<< HEAD
import { IsOptional, IsString } from 'class-validator';
=======
import { IsOptional, IsString } from "class-validator";
>>>>>>> origin/aashika

export class CreateBeautyAppointmentDto {
  @IsString()
  listingId: string;

  @IsString()
  slotId: string;

  @IsString()
  customerName: string;

  @IsOptional()
  @IsString()
  notes?: string;
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/aashika
