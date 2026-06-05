import { Controller, Get } from '@nestjs/common';

@Controller({ path: 'users', version: '1' })
export class UsersController {
  @Get()
  findAll(): { message: string } {
    return { message: 'TODO: implement' };
  }
}
