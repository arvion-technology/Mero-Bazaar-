import { PartialType } from "@nestjs/mapped-types";
import { CreateBeautySlotDto } from "./create_beauty_slot.dto";

export class UpdateBeautySlotDto extends PartialType(CreateBeautySlotDto) {}