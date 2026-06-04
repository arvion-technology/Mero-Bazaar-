import { AppointmentStatus } from "@prisma/client";
import { IsEnum } from "class-validator";

export class UpdateBeautyAppointmentStatusDto {
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;
}