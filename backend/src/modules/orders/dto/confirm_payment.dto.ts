import { IsEnum, IsString, MinLength } from "class-validator";
import { PaymentMethod } from "@prisma/client";

export class ConfirmPaymentDto {
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsString()
  @MinLength(4)
  providerTransactionId: string;
}