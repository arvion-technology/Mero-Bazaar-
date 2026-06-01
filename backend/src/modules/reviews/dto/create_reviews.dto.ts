import { IsInt, IsOptional, IsString, Min, Max, IsNotEmpty } from "class-validator";
import { Type, Transform } from "class-transformer";

export class CreateReviewDto {
  @IsString()
  listingId: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  reviewerName?: string;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  comment?: string;
}