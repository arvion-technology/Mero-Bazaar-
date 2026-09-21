import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';
import { InMemoryRateLimiter } from 'src/common/utils/rate-limit';

/**
 * Reusable per-client fixed-window rate limiter (in-memory, per-process).
 * Apply with `@UseGuards(new RateLimitGuard(windowMs, max))` at class or method
 * level. For multi-instance deployments replace the backing store with Redis;
 * this is still far better than no throttle for the public search/geocode
 * endpoints that back onto shared, quota-limited services.
 */
@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly limiter: InMemoryRateLimiter;

  constructor(
    private readonly windowMs: number,
    private readonly max: number,
    private readonly message = 'Too many requests. Please slow down.',
  ) {
    this.limiter = new InMemoryRateLimiter(windowMs, max);
  }

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const key =
      (req.ip ?? req.socket?.remoteAddress ?? 'unknown') +
      '|' +
      (req.headers['user-agent'] ?? '');

    if (!this.limiter.tryConsume(key)) {
      throw new HttpException(this.message, HttpStatus.TOO_MANY_REQUESTS);
    }
    return true;
  }
}
