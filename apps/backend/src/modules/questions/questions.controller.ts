import { Controller, Get } from '@nestjs/common';

@Controller({ path: 'questions', version: '1' })
export class QuestionsController {
  @Get()
  findAll(): { message: string } {
    return { message: 'TODO: implement' };
  }
}
