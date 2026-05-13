import { Injectable } from "@nestjs/common";
import { VehicleStrategy } from "./strategies/vehicle.strategy";
import { JobStrategy } from "./strategies/jobs.strategy";
import { SearchDto } from "./dto/search.dto";
import { ListingsService } from "src/modules/listings/listings.service";

@Injectable()
export class SearchService {
  constructor(
    private vehicleStrategy: VehicleStrategy,
    private jobStrategy: JobStrategy,
    private listingService: ListingsService,
  ) {}

  async search(filters: SearchDto) {
    switch (filters.type) {
      case "vehicle":
        return this.vehicleStrategy.search({
          brand: filters.query,
          model: filters.query,
        });

      case "job":
        return this.jobStrategy.search({
          query: filters.query,
        });

      default:
        return Promise.all([
          this.vehicleStrategy.search({
            brand: filters.query,
            model: filters.query,
          }),

          this.jobStrategy.search({
            query: filters.query,
          }),

          this.listingService.search({
            query: filters.query,
          } as any),
        ]);
    }
  }
}