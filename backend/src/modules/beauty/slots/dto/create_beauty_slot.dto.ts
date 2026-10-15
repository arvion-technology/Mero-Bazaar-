import { WeekDay } from '@prisma/client';
import { IsString, IsEnum, Matches } from 'class-validator';

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

export class CreateBeautySlotDto {
  @IsString()
  beautyId: string;

  @IsEnum(WeekDay)
  day: WeekDay;

  @Matches(HHMM, { message: 'startTime must be HH:mm (24h), e.g. 09:30' })
  startTime: string;

  @Matches(HHMM, { message: 'endTime must be HH:mm (24h), e.g. 17:00' })
  endTime: string;
}