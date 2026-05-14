import { MedicalCategory } from '@prisma/client';

export class CreateMedicalDto {
  category: MedicalCategory;
  title: string;
  description?: string;
  doctorName: string;
  speciality: string;
  nmcLicenseNumber: string;
  appointmentFee: number;
  availableSlots: string[];
  homeVisitAvailable?: boolean;
  clinicAddress: string;
  city: string;
  latitude?: number;
  longitude?: number;
}