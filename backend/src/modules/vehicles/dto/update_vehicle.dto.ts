import { PartialType } from "@nestjs/mapped-types";
import { CreateVehicleDto } from "./create_vehicle.dto";

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {}