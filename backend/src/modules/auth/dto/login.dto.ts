<<<<<<< HEAD
import { IsEmail, IsString } from 'class-validator';
=======
import { IsEmail, IsString } from "class-validator";
>>>>>>> origin/aashika

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/aashika
