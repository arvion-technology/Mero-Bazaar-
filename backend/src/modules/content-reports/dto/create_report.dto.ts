import { ReportReason, ReportTargetType } from "@prisma/client";
import { IsEnum, IsOptional, IsString, MaxLength, Validate, ValidateIf } from "class-validator";

export class CreateReportDto {
  @IsEnum(ReportTargetType)
  targetType: ReportTargetType;

  @ValidateIf((o) => o.targetType === ReportTargetType.LISTING)
  @IsString()
  listingId?: string;

  @ValidateIf((o) => o.targetType === ReportTargetType.USER)
  @IsString()
  targetUserId?: string;
 
  @ValidateIf((o) => o.targetType === ReportTargetType.REVIEW)
  @IsString()
  reviewId?: string;

  @IsEnum(ReportReason)
  reason: ReportReason;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;
}