import { IsString } from "class-validator";

export class ToggleWishlistDto {
  @IsString()
  listingId: string;
}