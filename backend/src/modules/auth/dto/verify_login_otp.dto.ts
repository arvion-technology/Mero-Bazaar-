import { IsString, Length } from 'class-validator';

export class VerifyLoginOtpDto {
  @IsString()
  tempToken: string;

  @IsString()
  @Length(6, 6)
  otp: string;
}