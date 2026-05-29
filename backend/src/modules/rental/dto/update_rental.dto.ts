import { PartialType } from "@nestjs/mapped-types";
import { CreateRentalDto } from "./create_rental.dto";

export class UpdateRentalDto extends PartialType(CreateRentalDto) {}