import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { PaymentMethod } from "@prisma/client";

export class ConfirmPaymentDto {
  @IsString()
  @IsNotEmpty()
  paymentRef: string;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}