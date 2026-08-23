<<<<<<< HEAD
import { WeekDay } from '@prisma/client';
import { IsString, IsEnum } from 'class-validator';
=======
import { WeekDay } from "@prisma/client";
import { IsString, IsEnum } from "class-validator";
>>>>>>> origin/aashika

export class CreateMedicalSlotDto {
  @IsString()
  medicalId: string;

  @IsEnum(WeekDay)
  day: WeekDay;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;
}
