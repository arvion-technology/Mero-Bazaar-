import { VerificationStatus } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class ReviewKycDto {
    @IsEnum(VerificationStatus) 
    status: VerificationStatus;

    @IsOptional()
    @IsString()
    rejectionReason?: string;
}