import { PartialType } from "@nestjs/mapped-types";
import { CreateMedicalAppointmentDto } from "./create_medical_appointment.dto";

export class UpdateMedicalAppointmentDto extends PartialType(CreateMedicalAppointmentDto) {}