import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from 'src/users/entities/users.entity';
import { JWT_SECRET } from './const/auth.const';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

     /**
      * 우리가 만드려는 기능
      * 
      * 1) registerWithEmail
      *   - email. nickname, password를 입력받고 사용자를 생성한다.
      *   - 생성이 완료되면 accessToken과 refreshToken을 발급한다.
      *     - 회원가입 후 다시 로그인해주세요 <- 이런 쓸데없는 과정을 방지하기 위해서
      * 
      * 2) loginWithEmail
      *   - email, password를 입력하면 사용자 검증을 진행한다.
      *   - 검증이 완료되면 accessToken과 refreshToken을 반환한다.
      * 
      * 3) loginUser
      *   - (1)과 (2)에서 필요한 accessToken과 refreshToken을 반환하는 로직 (일반화, 반복적인 코드 X)
      * 
      * 4) signToken
      *   - (3)에서 필요한 accessToken과 refreshToken을 sign하는 로직
      *   - 토큰 생성 로직
      * 
      * 5) authenticateWithEmailAndPassword
      *   - (2) 로그인을 진행할때 필요한 기본적인 검증 진행
      *     1. 사용자가 존재하는지 확인 (email)
      *     2. 비밀번호가 맞는지 확인
      *     3. 모두 통과되면 찾은 사용자 정보 반환
      *     4. loginWithEmail에서 반환된 데이터를 기반으로 토큰 생성
      */

     constructor(
          private readonly jwtService: JwtService,
          private readonly usersService: UsersService,
     ) {}

     /**
      * Payload에 들어갈 정보
      * 
      * 1) email
      * 2) sub -> id(사용자)
      * 3) type : 'access' | 'refresh'
      * 
      * Pick : 타입스크립트 유틸리티 특정 프로퍼티만 뽑아오는 것
      * {email: string, id: number} 결과와 동일하지만 문맥상 이해가 쉬움
      */
     signToken(user: Pick<UsersModel, 'email' | 'id'>, isRefreshToken: boolean) {
          const payload = {
               email: user.email,
               id: user.id,
               type: isRefreshToken ? 'refresh' : 'access',
          };

          return this.jwtService.sign(payload, {
               secret: JWT_SECRET,
               // secondes (초 단위)
               expiresIn: isRefreshToken ? 3600 : 300, // ? refresh : access
          });
     }

     loginUser(user: Pick<UsersModel, 'email' | 'id'>) {
          return {
               accessToken: this.signToken(user, false),
               refreshToken: this.signToken(user, true),
          }
     }

     async authenticateWithEmailAndPassword(user: Pick<UsersModel, 'email' | 'password'>) {
          /**
           * 1. 사용자가 존재하는지 확인 (email) -> userService에다가 기능을 만들기
           * 2. 비밀번호가 맞는지 확인
           * 3. 모두 통과되면 찾은 사용자 정보 반환
           */
          const existingUser = await this.usersService.getUserByEmail(user.email);
          if (!existingUser) {
               throw new UnauthorizedException('존재하지 않는 사용자입니다.');
          }

          /**
           * 파라미터
           * 
           * 1. 입력된 비밀번호
           * 2. 기존 해시 (hash) -> 사용자 정보에 저장된 hash
           */
          const passOK = await bcrypt.compare(user.password, existingUser.password);
          if (!passOK) {
               throw new UnauthorizedException('비밀번호가 틀렸습니다.');
          }
          return existingUser;
     }

     async loginWithEmail(user: Pick<UsersModel, 'email' | 'password'>) {
          const existingUser = await this.authenticateWithEmailAndPassword(user);
          return this.loginUser(existingUser);
     }
}
