import { Controller, Get } from '@nestjs/common';

@Controller({ path: 'ai', version: '1' })
export class AiController {
  @Get()
  findAll(): { message: string } {
    return { message: 'TODO: implement' };
  }
}
