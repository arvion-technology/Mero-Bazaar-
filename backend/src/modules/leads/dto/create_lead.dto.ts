import { IsEnum, IsString, IsOptional } from 'class-validator';
import { LeadType } from '@prisma/client';

export class CreateLeadDto {
  @IsString()
  listingId: string;

  @IsString()
  @IsOptional()
  userId?: string; //hardcorded untill userauth is created

  @IsEnum(LeadType)
  leadType: LeadType;

  @IsString()
  @IsOptional()
  message?: string;
}