import { PartialType } from "@nestjs/mapped-types";
import { CreateAgricultureDto } from "./create_agriculture.dto";

export class UpdateAgricultureDto extends PartialType(CreateAgricultureDto) {}