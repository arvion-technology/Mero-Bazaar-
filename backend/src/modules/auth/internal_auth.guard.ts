import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { timingSafeEqual } from 'crypto';

@Injectable()
export class InternalAuthGuard implements CanActivate {
  private readonly secret: string;

  constructor() {
    const secret = process.env.INTERNAL_API_SECRET;
    if (!secret || secret.length < 16) {
      throw new Error(
        'INTERNAL_API_SECRET is missing or too short (need 16+ chars). Refusing to start.',
      );
    }
    this.secret = secret;
  }
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const provided = req.headers['x-internal-secret'];
    if (!provided || typeof provided !== 'string') {
      throw new UnauthorizedException('Invalid internal request');
    }
    // Constant-time comparison to avoid leaking the shared secret through timing.
    const a = Buffer.from(provided);
    const b = Buffer.from(this.secret);
    const equal = a.length === b.length && timingSafeEqual(a, b);
    if (!equal) {
      throw new UnauthorizedException('Invalid internal request');
    }
    return true;
  }
}
