import { Controller, Get } from '@nestjs/common';

@Controller({ path: 'tryouts', version: '1' })
export class TryoutsController {
  @Get()
  findAll(): { message: string } {
    return { message: 'TODO: implement' };
  }
}
