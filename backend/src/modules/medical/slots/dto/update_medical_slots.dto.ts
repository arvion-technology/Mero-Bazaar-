import { PartialType } from "@nestjs/mapped-types";
import { CreateMedicalSlotDto } from "./create_medical_slots.dto";

export class UpdateMedicalSlotDto extends PartialType(CreateMedicalSlotDto) {}