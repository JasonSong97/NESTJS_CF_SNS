import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";

// callback 함수
// data: 데코레이터 내부에 입력해주는 값
export const User = createParamDecorator((data, context: ExecutionContext) => {

     const req = context.switchToHttp().getRequest();
     const user = req.user;
     // user 데코레이터를 accessToken과 함께 사용하지 않으면 발생
     if (!user) throw new InternalServerErrorException('User 데코레이터는 AccessTokenGuard와 함께 사용해야합니다.');

     return user; // User 데코레이터를 parameter에 사용했을 때, parameter의 arg 값 return
});