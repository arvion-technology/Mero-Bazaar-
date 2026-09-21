import { IsString, MinLength, MaxLength } from 'class-validator';

export class RaiseDisputeDto {
  @IsString()
  @MinLength(5)
  @MaxLength(2000)
  reason: string;
}
