<<<<<<< HEAD
import { IsNotEmpty, IsString } from 'class-validator';
=======
import { IsNotEmpty, IsString } from "class-validator";
>>>>>>> origin/aashika

export class InitiateConnectipsDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/aashika
