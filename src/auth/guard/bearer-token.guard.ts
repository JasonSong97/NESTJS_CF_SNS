import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';

/**
 * BearerTokenGuard는 사용할일이 없다.
 * 단지, AccessTokenGuard와 RefreshTokenGuard를 사용하기 위해서 존재한다.
 */

@Injectable()
export class BearerTokenGuard implements CanActivate {

     constructor(
          private readonly authService: AuthService,
          private readonly usersService: UsersService,
     ) {}

     async canActivate(context: ExecutionContext): Promise<boolean> { // false: Guard 통과 X true: Guard 통과 O
          const req = context.switchToHttp().getRequest();
     
          const rawToken = req.headers['authorization'];
          if (!rawToken) {
               throw new UnauthorizedException('토큰이 없습니다.!');
          }

          const token = this.authService.extractTokenFromHeader(rawToken, true);
          const result = await this.authService.verifyToken(token); // token내부의 payload = result

          /**
           * request에 넣을 정보
           * 
           * 1) 사용자 정보 - user
           * 2) token - token
           * 3) tokenType - access | refresh
           */
          const user = await this.usersService.getUserByEmail(result.email);

          req.user = user;
          req.token = token;
          req.tokenType = result.type;

          return true;
     }
}

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {

     async canActivate(context: ExecutionContext): Promise<boolean> { // false: Guard 통과 X true: Guard 통과 O
          await super.canActivate(context); // 부모 실행
          const req = context.switchToHttp().getRequest();

          // 토큰 type이 access 인지 확인
          if (req.tokenType !== 'access') {
               throw new UnauthorizedException('Access Token이 없습니다.');
          }
          return true;
     }
}

@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {

     async canActivate(context: ExecutionContext): Promise<boolean> { // false: Guard 통과 X true: Guard 통과 O
          await super.canActivate(context); // 부모 실행
          const req = context.switchToHttp().getRequest();

          // 토큰 type이 refresh 인지 확인
          if (req.tokenType !== 'refresh') {
               throw new UnauthorizedException('Refresh Token이 없습니다.');
          }
          return true;
     }
}