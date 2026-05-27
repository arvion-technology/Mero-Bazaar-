import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { FoodType, PriceUnit, WeekDay } from '@prisma/client';

export class CreateFoodsAndHomeDeliveryDto {
  @IsOptional()
  @IsEnum(FoodType)
  foodType?: FoodType;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  price?: number;

  @IsOptional()
  @IsEnum(PriceUnit)
  priceUnit?: PriceUnit;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  deliveryRadiusKm?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  subscriptionAvailable?: boolean;

  @IsOptional()
  @IsArray()
  @IsEnum(WeekDay, { each: true })
  deliveryDays?: WeekDay[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minOrderAmount?: number;
}