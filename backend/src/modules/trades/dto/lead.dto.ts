import { IsString, IsEnum } from "class-validator";
import { LeadType } from "@prisma/client";

export class CreateLeadDto {
  @IsEnum(LeadType)
  leadType: LeadType;

  @IsString()
  customerName: string;

  @IsString()
  customerPhone: string;
}