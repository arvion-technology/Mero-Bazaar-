<<<<<<< HEAD
import { WeekDay } from '@prisma/client';
import { IsString, IsEnum } from 'class-validator';
=======
import { WeekDay } from "@prisma/client";
import { IsString, IsEnum } from "class-validator";
>>>>>>> origin/aashika

export class CreateBeautySlotDto {
  @IsString()
  beautyId: string;

  @IsEnum(WeekDay)
  day: WeekDay;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/aashika
