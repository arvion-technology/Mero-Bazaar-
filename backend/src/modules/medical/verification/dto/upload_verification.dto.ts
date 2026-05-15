import { IsString, IsNotEmpty } from 'class-validator';

export class UploadVerificationDto {
  @IsString()
  @IsNotEmpty()
  medicalId: string;

  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @IsString()
  @IsNotEmpty()
  filePath: string;
}