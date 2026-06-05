import { Controller, Get } from '@nestjs/common';

@Controller({ path: 'attempts', version: '1' })
export class AttemptsController {
  @Get()
  findAll(): { message: string } {
    return { message: 'TODO: implement' };
  }
}
