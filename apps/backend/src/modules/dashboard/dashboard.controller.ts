import { Controller, Get } from '@nestjs/common';

@Controller({ path: 'dashboard', version: '1' })
export class DashboardController {
  @Get()
  findAll(): { message: string } {
    return { message: 'TODO: implement' };
  }
}
