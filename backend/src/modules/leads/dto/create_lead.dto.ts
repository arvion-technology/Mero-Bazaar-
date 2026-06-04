import { IsEnum, IsString } from "class-validator";
import { LeadType } from '@prisma/client';

export class CreateLeadDto {
  @IsString()
  listingId: string;

  @IsEnum(LeadType)
  leadType: LeadType;
}