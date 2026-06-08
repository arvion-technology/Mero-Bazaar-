import { PartialType } from "@nestjs/mapped-types";
import { CreateMedicalDto } from "./create_medical.dto";

export class UpdateMedicalDto extends PartialType(CreateMedicalDto) {}