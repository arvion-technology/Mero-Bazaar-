import { Injectable, BadRequestException } from "@nestjs/common";
import { VehicleStrategy } from "./strategies/vehicle.strategy";
import { JobStrategy } from "./strategies/jobs.strategy";
import { SearchDto } from "./dto/search.dto";
import { VehicleSearchDto } from "./dto/vehicle_search.dto";
import { JobSearchDto } from "./dto/job_search.dto";

@Injectable()
export class SearchService {
  constructor(
    private vehicleStrategy: VehicleStrategy,
    private jobStrategy: JobStrategy,
  ) {}

  async search(filters: SearchDto) {
    switch (filters.type) {
      case "vehicle":
        return this.vehicleStrategy.search(filters as VehicleSearchDto);

      case "job":
        return this.jobStrategy.search(filters as JobSearchDto);

      default:
        throw new BadRequestException(
          "Please specify search type (vehicle, job)",
        );
    }
  }
}