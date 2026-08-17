import { IsString, MinLength } from 'class-validator';

export class RaiseDisputeDto {
  @IsString()
  @MinLength(5)
  reason: string;
}