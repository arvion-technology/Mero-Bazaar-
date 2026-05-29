import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { FoodType, PriceUnit, WeekDay } from '@prisma/client';

export class CreateFoodsAndHomeDeliveryDto {
  @IsEnum(FoodType)
  foodType: FoodType;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  price: number;

  @IsEnum(PriceUnit)
  priceUnit: PriceUnit;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  deliveryRadiusKm: number;

  @Type(() => Boolean)
  @IsBoolean()
  subscriptionAvailable: boolean;

  @IsArray()
  @IsEnum(WeekDay, { each: true })
  deliveryDays: WeekDay[];

  @Type(() => Number)
  @IsInt()
  @Min(0)
  minOrderAmount: number;
}