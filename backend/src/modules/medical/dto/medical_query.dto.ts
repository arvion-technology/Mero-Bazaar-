import { Transform } from 'class-transformer';

export class MedicalQueryDto {
  city?: string;
  speciality?: string;
  doctorName?: string;

  @Transform(({ value }) => value === 'true')
  homeVisitAvailable?: boolean;
}