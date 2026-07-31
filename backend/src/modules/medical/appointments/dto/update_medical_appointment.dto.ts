import { IsEnum } from 'class-validator';
import { AppointmentStatus } from '@prisma/client';

export class UpdateMedicalAppointmentStatusDto {
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;
}