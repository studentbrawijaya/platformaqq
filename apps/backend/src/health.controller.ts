import { Controller, Get } from '@nestjs/common';

@Controller({ path: 'health', version: '1' })
export class HealthController {
  @Get()
  getHealth(): { status: string; db: string; redis: string; timestamp: string } {
    return {
      status: 'ok',
      db: 'ok',
      redis: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
