import { IsString, IsEnum, Matches } from 'class-validator';
import { OtpContext } from '@prisma/client';

export class VerifyOtpDto {
  @IsString()
  @Matches(/^(98|97)\d{8}$/, { message: 'Invalid Nepal phone number' })
  phone: string;

  @IsString()
  otp: string;

  @IsEnum(OtpContext)
  context: OtpContext;
}