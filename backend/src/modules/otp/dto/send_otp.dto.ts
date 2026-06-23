import { IsEnum, IsString, Matches } from "class-validator";
import { OtpContext } from "@prisma/client";

export class SendOtpDto {
    @IsString()
    @Matches(/^(98|97)\d{8}$/, { message: 'Invalid Nepal phone number' })
    phone: string;

    @IsEnum(OtpContext)
    context: OtpContext;
}