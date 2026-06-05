import { Controller, Get } from '@nestjs/common';

@Controller({ path: 'subjects', version: '1' })
export class SubjectsController {
  @Get()
  findAll(): { message: string } {
    return { message: 'TODO: implement' };
  }
}
