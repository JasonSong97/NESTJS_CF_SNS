import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  @Post()
  async postUser(
    @Body('nickname') nickname: string, 
    @Body('email') email: string, 
    @Body('password') password: string
  ) {
    return await this.usersService.createUser(nickname, email, password);
  }

  @Get()
  async getUsers() {
    return this.usersService.getAllUsers();
  }
}
