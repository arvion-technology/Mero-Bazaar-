import { IsOptional, IsString, IsBoolean, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { MedicalServiceType } from '@prisma/client';

export class MedicalQueryDto {
  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsEnum(MedicalServiceType)
  specialty?: MedicalServiceType;

<<<<<<< HEAD
=======

>>>>>>> origin/aashika
  @IsOptional()
  @IsString()
  doctorName?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  homeVisitAvailable?: boolean;
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/aashika
