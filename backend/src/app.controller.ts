import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
<<<<<<< HEAD

  // Liveness endpoint for container health checks. Never exposes secrets or internals.
  @Get('health')
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
=======
>>>>>>> origin/aashika
}
