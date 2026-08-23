<<<<<<< HEAD
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { timingSafeEqual } from 'crypto';
=======
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
>>>>>>> origin/aashika

@Injectable()
export class InternalAuthGuard implements CanActivate {
  private readonly secret: string;

<<<<<<< HEAD
  constructor() {
    const secret = process.env.INTERNAL_API_SECRET;
    if (!secret || secret.length < 16) {
      throw new Error(
        'INTERNAL_API_SECRET is missing or too short (need 16+ chars). Refusing to start.',
      );
=======
  constructor(){
    const secret = process.env.INTERNAL_API_SECRET;
    if (!secret) {
      throw  new Error('INTERNAL_API_SECRET is not configured.');
>>>>>>> origin/aashika
    }
    this.secret = secret;
  }
  canActivate(context: ExecutionContext): boolean {
<<<<<<< HEAD
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
=======
    const req = context.switchToHttp().getRequest(); 
    const provided = req.headers['x-internal-secret'];
    if (!provided || provided !== this.secret) {
>>>>>>> origin/aashika
      throw new UnauthorizedException('Invalid internal request');
    }
    return true;
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/aashika
