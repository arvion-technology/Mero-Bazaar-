import { IsArray, IsBoolean, IsEnum, IsInt, IsOptional, Min, Max } from "class-validator";
import { FoodType, PriceUnit, WeekDay } from "@prisma/client";
import { Type } from "class-transformer";

export class QueryFoodsAndHomeDeliveryDto {
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
  @Min(0)
  minDeliveryRadiusKm?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxDeliveryRadiusKm?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  subscriptionAvailable?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxMinOrderAmount?: number;

  @IsOptional()
  @IsArray()
  @IsEnum(WeekDay, { each: true })
  deliveryDays?: WeekDay[];

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(5)
  minHygieneRating?: number;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(5)
  maxHygieneRating?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  radiusKm?: number;
}