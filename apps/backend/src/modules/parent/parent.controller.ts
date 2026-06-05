import { Controller, Get } from '@nestjs/common';

@Controller({ path: 'parent', version: '1' })
export class ParentController {
  @Get()
  findAll(): { message: string } {
    return { message: 'TODO: implement' };
  }
}
