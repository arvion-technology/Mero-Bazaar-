import { IsEnum, IsString, IsOptional } from 'class-validator';
import { LeadType } from '@prisma/client';

export class CreateLeadDto {
  @IsEnum(LeadType)
  leadType: LeadType;

  @IsString()
  listingId: string;

  @IsOptional()
  @IsString()
  message?: string;
}