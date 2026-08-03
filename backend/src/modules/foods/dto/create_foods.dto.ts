import { Type } from "class-transformer";
import { IsArray, IsEnum, IsInt, IsString, IsNotEmpty, Min } from "class-validator";
import { FoodType, PriceUnit, WeekDay } from '@prisma/client';

export class CreateFoodsAndHomeDeliveryDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(FoodType)
  foodType: FoodType;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  price: number;

  @IsEnum(PriceUnit)
  priceUnit: PriceUnit;

  @IsArray()
  @IsEnum(WeekDay, { each: true })
  deliveryDays: WeekDay[];
}