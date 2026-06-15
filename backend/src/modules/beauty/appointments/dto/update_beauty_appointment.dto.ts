import { PartialType } from "@nestjs/mapped-types";
import { CreateBeautyAppointmentDto } from "./create_beauty_appointment.dto";

export class UpdateBeautyAppointmentDto extends PartialType(CreateBeautyAppointmentDto) {}