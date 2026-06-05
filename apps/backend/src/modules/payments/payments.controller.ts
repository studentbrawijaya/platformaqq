import { Controller, Get } from '@nestjs/common';

@Controller({ path: 'payments', version: '1' })
export class PaymentsController {
  @Get()
  findAll(): { message: string } {
    return { message: 'TODO: implement' };
  }
}
