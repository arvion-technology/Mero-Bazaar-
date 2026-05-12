import { PartialType } from '@nestjs/mapped-types';
import { CreateListingDto } from './create_listing.dto';

export class UpdateListingDto extends PartialType(CreateListingDto) {}