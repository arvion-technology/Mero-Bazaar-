import { IsDateString, IsInt, IsString, Min } from "class-validator";
import { Type } from "class-transformer";

export class CreateOrderDto {
  @IsString()
  listingId: string;

  @IsInt()
  @Type(() => Number)
  @Min(1)
  quantity: number;

  @IsDateString()
  deliveryDate: string;

  @IsString()
  deliveryAddress: string;
}