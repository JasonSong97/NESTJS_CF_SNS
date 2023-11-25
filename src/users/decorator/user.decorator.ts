import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";
import { UsersModel } from "../entities/users.entity";

// callback 함수
// data: 데코레이터 내부에 입력해주는 값
export const User = createParamDecorator((data: keyof UsersModel | undefined, context: ExecutionContext) => {
     // 여기서 중요한 것: 데코레이터안에 입력되는 값을 data로 받을 수 있고, type을 지정해서 특정 값만 들어오도록 선언이 가능
     // data: keyof UsersModel | undefined

     const req = context.switchToHttp().getRequest();
     const user = req.user as UsersModel; // 사용자가 있다는 가정
     if (!user) throw new InternalServerErrorException('User 데코레이터는 AccessTokenGuard와 함께 사용해야합니다.'); // user 데코레이터를 accessToken과 함께 사용하지 않으면 발생

     if (data) return user[data]; // data가 undefined가 아니면

     return user; // User 데코레이터를 parameter에 사용했을 때, parameter의 arg 값 return
});