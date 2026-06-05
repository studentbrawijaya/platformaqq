import { Controller, Get } from '@nestjs/common';

@Controller({ path: 'skills', version: '1' })
export class SkillsController {
  @Get()
  findAll(): { message: string } {
    return { message: 'TODO: implement' };
  }
}
