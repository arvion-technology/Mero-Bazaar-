import { AppointmentStatus } from "@prisma/client";
import { IsEnum } from "class-validator";

export class UpdateMedicalAppointmentStatusDto {
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;
}