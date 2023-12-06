import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from 'src/users/entities/users.entity';
import { HASH_ROUNDS, JWT_SECRET } from './const/auth.const';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';

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
          if (!existingUser) throw new UnauthorizedException('존재하지 않는 사용자입니다.');

          /**
           * bcrypt.compare(1, 2) 파라미터
           * 
           * 1. 입력된 비밀번호
           * 2. 기존 해시 (hash) -> 사용자 정보에 저장된 hash
           */
          const passOK = await bcrypt.compare(user.password, existingUser.password);
          if (!passOK) throw new UnauthorizedException('비밀번호가 틀렸습니다.');
          return existingUser;
     }

     async loginWithEmail(user: Pick<UsersModel, 'email' | 'password'>) {
          const existingUser = await this.authenticateWithEmailAndPassword(user);
          return this.loginUser(existingUser);
     }

     async registerWithEmail(user: RegisterUserDto) {
          const hash = await bcrypt.hash( // 내부에 salt가 내장
               user.password,
               // hash rounds
               HASH_ROUNDS,
          );

          const newUser = await this.usersService.createUser({
               ...user,
               password: hash,
          });
          return this.loginUser(newUser);
     }

     /**
      * 토큰을 사용하게 되는 방식
      * 
      * 1) 사용자가 로그인 또는 회원가입을 진행하면
      *   accessToken과 refreshToken을 발급받는다.
      * 
      * 2) 로그인 할때는 Basic 토큰과 함께 요청을 보낸다.
      *   Basic 토큰은 '이메일:비밀번호'를 Base64로 인코딩한 형태이다.
      *   예) {authorization: 'Basic {token}'} -> 계정정보
      * 
      * 3) 아무나 접근 할 수 없는 정보 {private route}를 접근 할때는 
      *   accessToken을 Header에 추가해서 요청과 함께 보낸다.
      *   예) {authorization: 'Bearer {access token}'} -> 발급받은 JWT 토큰을 그대로 넣었을 때
      * 
      * 4) 토큰과 요청을 함께 받은 서버는 토큰 검증을 통해 현재 요청을 보낸
      *   사용자가 누구인지 알 수 있다.
      *   예) 현재 로그인한 사용자가 작성한 포스트만 가져오려면
      *   토큰의 sub 값에 입력돼있는 사용자의 포스트만 따로 필터링 할 수 있다.
      *   특정 사용자의 토큰이 없다면 다른 사용자의 데이터를 접근 못한다.
      * 
      * 5) 모든 토큰은 만료 기간이 있다. 만료기간이 지나면 새로 토큰을 발급받아야한다.
      *   그렇지 않으면 jwtService.verify()에서 인증이 통과 안된다.
      *   그러니 access 토큰을 새로 발급 받을 수 있는 /auth/token/access와
      *   refresh 토큰을 새로 발급 받을 수 있는 /auth/token/refresh가 필요하다.
      * 
      * 6) 토큰이 만료되면 각각의 토큰을 새로 발급 받을 수 있는 엔드포인트에 요청을 해서
      *   새로운 토큰을 발급받고 새로운 토큰을 사용해서 private route에 접근한다.
      */

     /**
      * Header로부터 토큰을 받을 때
      * 
      * LOGIN: {authorization: 'Basic {token}'}
      * ACCESS API: {authorization: 'Bearer {token}'}
      */
     extractTokenFromHeader(header: string, isBearer: boolean) {
          // 'Basic {token}' -> [Basic, {token}]]
          // 'Bearer {token}' -> [Bearer, {token}]]
          const splitToken = header.split(' ');
          const prefix = isBearer ? 'Bearer' : 'Basic';
          if (splitToken.length !== 2 || splitToken[0] !== prefix) throw new UnauthorizedException('잘못된 토큰입니다!');

          const token = splitToken[1];
          return token;
     }

     /**
      * Basic asdln1k4jnrfsdkfh123edsa
      * 
      * 1) asdln1k4jnrfsdkfh123edsa -> Decoding ->  email:password
      * 2) email:password -> [email, password]
      * 3) {email: email, password: password}
      */
     decodeBasicToken(base64String: string) {
          // asdln1k4jnrfsdkfh123edsa -> Decoding -> email:password
          const decoded = Buffer.from(base64String, 'base64').toString('utf8');
          // email:password -> [email, password]
          const split = decoded.split(':');
          if (split.length !== 2) {
               throw new UnauthorizedException('잘못된 유형의 토큰입니다.');
          }
          const email = split[0];
          const password = split[1];
          // {email: email, password: password}
          return {
               email,
               password,
          }
     }

     /**
      * 토큰 재발급
      */
     rotateToken(token: string, isRefreshToken: boolean) {
          const decoded = this.jwtService.verify(token, {
               secret: JWT_SECRET,
          });

          /**
           * Payload에 들어갈 정보
           * 
           * email
           * sub -> id(사용자)
           * type : 'access' | 'refresh'
           */
          if (decoded.type !== 'refresh') throw new UnauthorizedException('토큰 재발급은 Refresh 토큰으로만 가능합니다!');
          return this.signToken({ // 토큰 새로 생성
               ...decoded,
          }, isRefreshToken);
     }

     /**
      * 토큰 검증
      */
     verifyToken(token: string) { // bearer-token,guard.ts로부터 213ibd1ebhwqjbhj 받음
          try {
               return this.jwtService.verify(token, {
                    secret: JWT_SECRET,
               });
          } catch (error) {
               throw new UnauthorizedException('토큰이 만료됐거나 잘못된 토큰입니다.');
          }
     }
}
