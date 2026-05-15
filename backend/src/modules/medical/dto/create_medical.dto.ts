import { MedicalCategory } from '@prisma/client';

export class CreateMedicalDto {
  category: MedicalCategory;

  doctorName: string;
  speciality: string;
  nmcLicenseNumber: string;

  appointmentFee: number;

  availableSlots: any; 
  
  homeVisitAvailable?: boolean;

  clinicAddress: string;
  city: string;

  latitude?: number;
  longitude?: number;
}