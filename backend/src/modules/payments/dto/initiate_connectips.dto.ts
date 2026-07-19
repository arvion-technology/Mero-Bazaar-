import { IsNotEmpty, IsString } from "class-validator";

export class InitiateConnectipsDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;
}