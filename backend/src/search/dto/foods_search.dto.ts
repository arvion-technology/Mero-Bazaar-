import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";
import { FoodType, PriceUnit, WeekDay } from "@prisma/client";

export class SearchFoodsDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsEnum(FoodType)
  foodType?: FoodType;

  @IsOptional()
  @IsEnum(PriceUnit)
  priceUnit?: PriceUnit;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  deliveryRadiusKm?: number;

  @IsOptional()
  @Transform(({ value }) => value === "true")
  subscriptionAvailable?: boolean;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === "string" ? value.split(",") : value
  )
  @IsArray()
  @IsEnum(WeekDay, { each: true })
  deliveryDays?: WeekDay[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minOrderAmount?: number;
}