import { IsEnum, IsString, IsOptional, MaxLength } from 'class-validator';
import { LeadType } from '@prisma/client';

export class CreateLeadDto {
  @IsEnum(LeadType)
  leadType: LeadType;

  @IsString()
  listingId: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  message?: string;
}
