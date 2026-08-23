<<<<<<< HEAD
import { IsEnum, IsString, MinLength } from 'class-validator';
import { PaymentMethod } from '@prisma/client';
=======
import { IsEnum, IsString, MinLength } from "class-validator";
import { PaymentMethod } from "@prisma/client";
>>>>>>> origin/aashika

export class ConfirmPaymentDto {
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsString()
  @MinLength(4)
  providerTransactionId: string;
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/aashika
