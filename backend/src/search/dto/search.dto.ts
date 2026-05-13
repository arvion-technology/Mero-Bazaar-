import { IsOptional, IsString, IsNumber, IsEnum } from "class-validator";
import { Type } from "class-transformer";
import { SearchType } from "src/common/enums/search-type.enum";
import { Min, Max } from "class-validator";

export class SearchDto {
  @IsOptional()
  @IsEnum(SearchType)
  type?: SearchType;
  
  @IsOptional()
  @IsString()
  query?: string;
  
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(20)
  limit?: number;
}