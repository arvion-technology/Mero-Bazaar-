import { WeekDay } from "@prisma/client";
import { IsString, IsEnum } from "class-validator";

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
