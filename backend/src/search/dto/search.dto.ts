import { IsOptional, IsString, IsNumber, IsEnum } from "class-validator";
import { Type } from "class-transformer";
import { SearchType } from "src/common/enums/search-type.enum";

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
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;
}