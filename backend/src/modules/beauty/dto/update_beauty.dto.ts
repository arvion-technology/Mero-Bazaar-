import { PartialType } from "@nestjs/mapped-types";
import { CreateHairBeautyAndWellnessDto } from "./create_beauty.dto";

export class UpdateHairBeautyAndWellnessDto extends PartialType (CreateHairBeautyAndWellnessDto) {}