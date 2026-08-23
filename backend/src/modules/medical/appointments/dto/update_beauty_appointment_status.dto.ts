<<<<<<< HEAD
import { AppointmentStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';
=======
import { AppointmentStatus } from "@prisma/client";
import { IsEnum } from "class-validator";
>>>>>>> origin/aashika

export class UpdateMedicalAppointmentStatusDto {
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/aashika
