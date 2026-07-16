import { IsString, IsNotEmpty, IsInt, Min, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDeliveryOrderDto {
  @IsString()
  @IsNotEmpty()
  listingId: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;

  @IsDateString()
  deliveryDate: string;

  @IsString()
  @IsNotEmpty()
  deliveryAddress: string;
}