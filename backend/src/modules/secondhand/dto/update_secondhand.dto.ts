import { PartialType } from "@nestjs/mapped-types";
import { CreateSecondHandDto } from "./create_secondhand.dto";

export class UpdateSecondHandDto extends PartialType(CreateSecondHandDto) {}