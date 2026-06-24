import { IsDateString, IsNotEmpty, IsString, Matches } from "class-validator";

export class SubmitKycDto {
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsDateString()
    dateOfBirth: string;

    @IsString()
    @Matches(/^(98|97)\d{8}$/, { message: 'Invalid phone number'})
    contactNumber: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @Matches(/^[A-Z]{2}-\d{5}$|^[A-Z]{2}\d{5}$|^\d{9}$/, {
        message: 'Invalid PAN number'
    })
    panNumber: string;

    @IsString()
    @IsNotEmpty()
    bankName: string;

    @IsString()
    @IsNotEmpty()
    account: string;

    @IsString()
    @IsNotEmpty()
    accountHolderName: string;
}