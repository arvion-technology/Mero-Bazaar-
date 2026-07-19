import { IsNotEmpty, IsString } from "class-validator";

export class InitiateKhaltiDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;
}