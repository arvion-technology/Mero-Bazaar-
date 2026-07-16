import { IsNotEmpty, IsString } from "class-validator";

export class ConfirmPaymentDto {
    @IsString()
    @IsNotEmpty()
    paymentRef: string;
}