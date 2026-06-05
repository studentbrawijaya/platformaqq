import { Controller, Get } from '@nestjs/common';

@Controller({ path: 'subscriptions', version: '1' })
export class SubscriptionsController {
  @Get()
  findAll(): { message: string } {
    return { message: 'TODO: implement' };
  }
}
