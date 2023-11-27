import { ClassSerializerInterceptor, Controller, Get, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor) // 하는 역할: user Entity에서 @Exclude() 확인
  /**
   * serialization -> 직렬화 -> 현재 시스템에서 사용되는 (Nest.js) 데이터의 구조를 다른 사스템에서도 쉽게
   *                           사용할 수 있는 포맷으로 변환
   *                        -> class의 object -> JSON 포맷으로 파싱
   * deserialization -> 역직렬화
   */
  async getUsers() {
    return this.usersService.getAllUsers();
  }

  // 사용자는 전부 auth에서 관리
  // @Post()
  // async postUser(
  //   @Body('nickname') nickname: string, 
  //   @Body('email') email: string, 
  //   @Body('password') password: string
  // ) {
  //   return await this.usersService.createUser({
  //     nickname,
  //     email,
  //     password,
  //   });
  // }
}
