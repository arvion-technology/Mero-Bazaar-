import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class RejectVerificationDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  reason: string;
}