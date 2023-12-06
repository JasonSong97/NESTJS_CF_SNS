import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";

/**
 * 구현할 기능
 * 
 * 1) 요청객체 (request)를 불러오고
 *   authorization header로부터 토큰을 가져온다.
 * 2) authService.extractTokenFromHeader를 이용해서
 *   사용 할 수 있는 형태의 토큰을 추출한다.
 * 3) authService.decodeBasicToken을 실행해서
 *   email과 password를 추출한다.
 * 4) email과 password를 이용해서 사용자를 가져온다.
 *   authService.authenticateWithEmailAndPassword
 * 5) 찾아낸 사용자를 (1) 요청 객체에 붙여준다.
 *   req.user = user;
 */
@Injectable()
export class BasicTokenGuard implements CanActivate {

     constructor(
          private readonly authService: AuthService,
     ) {}
     
     async canActivate(context: ExecutionContext): Promise<boolean> { // false: Guard 통과 X true: Guard 통과 O
          // context -> switchToHttp, switchToRpc, switchToWs
          const req = context.switchToHttp().getRequest(); // 요청 가져오기
          // {authorization: 'Basic 213ibd1ebhwqjbhj'}
          const rawToken = req.headers['authorization'];  // Basic 213ibd1ebhwqjbhj
          if (!rawToken) throw new UnauthorizedException('토큰이 없습니다1');

          const token = this.authService.extractTokenFromHeader(rawToken, false); // 213ibd1ebhwqjbhj
          const {email, password} = this.authService.decodeBasicToken(token); // 213ibd1ebhwqjbhj -> email, password
          const user = await this.authService.authenticateWithEmailAndPassword({
               email,
               password,
          });
          req.user = user; // response 전까지 
          return true;
     }
}