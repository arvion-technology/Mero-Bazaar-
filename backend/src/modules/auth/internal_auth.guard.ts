import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class InternalAuthGuard implements CanActivate {
  private readonly secrect: string;

  constructor(){
    const secrect = process.env.INTERNAL_API_SECRECT;
    if (!secrect) {
        throw  new Error('INTERNAL_API_SECRECT is not configured.');
    }
    this.secrect = secrect;
  }
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest(); 
    const provided = req.headers['x-internal-secrect'];
    if (!provided || provided !== this.secrect) {
      throw new UnauthorizedException('Invalid internal request');
    }
    return true;
  }
}