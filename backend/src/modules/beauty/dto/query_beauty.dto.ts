import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { BeautyServiceType } from "@prisma/client";

export class QueryHairBeautyAndWellnessDto {
  @IsOptional()
  @IsEnum(BeautyServiceType)
  serviceType?: BeautyServiceType;

  @IsOptional()
  @IsBoolean()
  homeVisit?: boolean;

  @IsOptional()
  @IsBoolean()
  bridalAvailable?: boolean;

  @IsOptional()
  @IsString()
  city?: string;
}