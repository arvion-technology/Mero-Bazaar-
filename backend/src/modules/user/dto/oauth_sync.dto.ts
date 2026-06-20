import { IsEmail, IsIn, IsOptional, IsString } from "class-validator";

export class OAuthSyncDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsIn(['USER', 'VENDOR'])
  role?: string;
}