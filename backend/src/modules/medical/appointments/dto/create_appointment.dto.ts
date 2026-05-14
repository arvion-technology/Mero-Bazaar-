export class CreateAppointmentDto {
  listingId: string;
  start_time: string;
  end_time: string;

  patientName: string;
  doctorId: string;
  medicalId: string;

  appointmentDate: string;
  timeSlot: string;

  reason?: string;
}