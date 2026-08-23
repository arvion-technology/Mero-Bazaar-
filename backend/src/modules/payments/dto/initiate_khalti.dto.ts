<<<<<<< HEAD
import { IsNotEmpty, IsString } from 'class-validator';
=======
import { IsNotEmpty, IsString } from "class-validator";
>>>>>>> origin/aashika

export class InitiateKhaltiDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/aashika
