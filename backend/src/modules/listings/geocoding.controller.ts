import { Controller, Get, Query, HttpException, HttpStatus } from "@nestjs/common";

@Controller('geocode')
export class GeocodingController {
  @Get('search')
  async search(@Query('q') query: string) {
    if (!query || query.trim().length < 3) {
      return [];
    }

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&countrycodes=np&limit=5`,
      { headers: { 'User-Agent': 'MeroBazaar/1.0 (contact@yourdomain.com)' } },
    );

    if (!res.ok) {
      throw new HttpException(
        `Nominatim request failed: ${res.status}`,
        HttpStatus.BAD_GATEWAY,
      );
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      return [];
    }

    return data;
  }
}