import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { ListingSearchDto } from './dto/listing_search.dto';
import { VehicleSearchDto } from './dto/vehicle_search.dto';
import { JobSearchDto } from './dto/job_search.dto';
import { MedicalSearchDto } from './dto/medical_search.dto';
import { TradesSearchDto } from './dto/trade_search.dto';
import { SecondHandSearchDto } from './dto/secondhand_search.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  search(@Query() filters: ListingSearchDto) {
    return this.searchService.search(filters);
  }

  @Get('vehicle')
  vehicle(@Query() filters: VehicleSearchDto) {
    return this.searchService.vehicleSearch(filters);
  }

  @Get('job')
  job(@Query() filters: JobSearchDto) {
    return this.searchService.jobSearch(filters);
  }

  @Get('medical')
  medical(@Query() filters: MedicalSearchDto) {
    return this.searchService.medicalSearch(filters);
  }

  @Get('trades')
  trades(@Query() filters: TradesSearchDto) {
    return this.searchService.tradesSearch(filters);
  }

  @Get('secondhand')
  secondhand(@Query() filters: SecondHandSearchDto) {
    return this.searchService.secondhandSearch(filters);
  }

}