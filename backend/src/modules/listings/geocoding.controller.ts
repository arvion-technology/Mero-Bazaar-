import { Controller, Get, Query } from "@nestjs/common";

@Controller('geocode')
export class Geocodingcontroller {
  @Get('search')
  async search(@Query('q') query: string) {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&countrycodes=np&limit=5`,
      { headers: { 'User-Agent': 'MeroBazaar/1.0 (contact@yourdomain.com)' } },
    );
    return res.json();
  }

}