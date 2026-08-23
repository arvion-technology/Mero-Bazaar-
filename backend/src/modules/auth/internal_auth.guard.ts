import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class InternalAuthGuard implements CanActivate {
  private readonly secret: string;

  constructor(){
    const secret = process.env.INTERNAL_API_SECRET;
    if (!secret) {
      throw  new Error('INTERNAL_API_SECRET is not configured.');
    }
    this.secret = secret;
  }
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest(); 
    const provided = req.headers['x-internal-secret'];
    if (!provided || provided !== this.secret) {
      throw new UnauthorizedException('Invalid internal request');
    }
    return true;
  }
}