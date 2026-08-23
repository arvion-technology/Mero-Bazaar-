<<<<<<< HEAD
import { IsNotEmpty, IsString } from 'class-validator';
=======
import { IsNotEmpty, IsString } from "class-validator";
>>>>>>> origin/aashika

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  listingId: string;
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/aashika
