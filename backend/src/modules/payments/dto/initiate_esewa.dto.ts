<<<<<<< HEAD
import { IsNotEmpty, IsString } from 'class-validator';

export class InitiateEsewaDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;
}
=======
import { IsNotEmpty, IsString } from "class-validator";

export  class InitiateEsewaDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;
}
>>>>>>> origin/aashika
