<<<<<<< HEAD
import { CreateFoodsAndHomeDeliveryDto } from './create_foods.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateFoodsAndHomeDeliveryDto extends PartialType(
  CreateFoodsAndHomeDeliveryDto,
) {}
=======
import { CreateFoodsAndHomeDeliveryDto } from "./create_foods.dto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateFoodsAndHomeDeliveryDto extends PartialType(CreateFoodsAndHomeDeliveryDto) {}
>>>>>>> origin/aashika
