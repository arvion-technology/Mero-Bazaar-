import { PartialType } from "@nestjs/mapped-types";
import { CreateJobDto } from "./create_job.dto";

export class UpdateJobDto extends PartialType(CreateJobDto) {}