import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { InMemoryRateLimiter } from '../../common/utils/rate-limit';

@Controller('geocode')
export class GeocodingController {
  // Nominatim's usage policy is ~1 req/s; throttle each client to ~1 req/s
  // (60/min) so the marketplace cannot be used to exhaust the shared geocoder.
  private readonly geocodeLimiter = new InMemoryRateLimiter(60 * 1000, 60);

  @Get('search')
  async search(@Query('q') query: string, @Req() req: Request) {
    if (!this.geocodeLimiter.tryConsume(this.clientKey(req))) {
      throw new HttpException(
        'Too many geocoding requests. Please slow down.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

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

  private clientKey(req: Request): string {
    return (
      (req.ip ?? req.socket?.remoteAddress ?? 'unknown') +
      '|' +
      (req.headers['user-agent'] ?? '')
    );
  }
}
