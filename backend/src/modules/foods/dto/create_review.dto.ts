import { IsInt, IsOptional, IsString , Min, Max } from "class-validator";
import { Type } from "class-transformer";

export class CreateReviewDto {
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;
}