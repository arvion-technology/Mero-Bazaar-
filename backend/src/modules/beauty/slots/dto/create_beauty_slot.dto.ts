import { WeekDay } from "@prisma/client";
import { IsString, IsEnum } from "class-validator";

export class CreateBeautySlotDto {
  @IsString()
  beautyId: string;

  @IsEnum(WeekDay)
  day: WeekDay;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;
}