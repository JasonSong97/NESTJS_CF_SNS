import { Body, Controller, Post, Headers, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MaxLengthPipe, MinLengthPipe, PasswordPipe } from './pipe/password.pipe';
import { BasicTokenGuard } from './guard/basic-token.guard';
import { AccessTokenGuard, RefreshTokenGuard } from './guard/bearer-tokne.guard';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard)
  postTokenRefresh(
    @Headers('authorization') rawToken: string,
  ) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);
    const newToken = this.authService.rotateToken(token, true);
    // {refreshToken: {token}}
    return {
      refreshToken: newToken,
    }
  }

  @Post('token/access')
  @UseGuards(RefreshTokenGuard)
  postTokenAccess(
    @Headers('authorization') rawToken: string,
  ) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);
    const newToken = this.authService.rotateToken(token, false);
    // {accessToken: {token}}
    return {
      accessToken: newToken,
    }
  }

  @Post('login/email')
  @UseGuards(BasicTokenGuard)
  postLoginEmail(
    // {authorization: 'Basic {token}'}
    // {authorization: 'Bearer {token}'}
    @Headers('authorization') rawToken: string,
  ) {
    // email:password -> Base64
    // aksjd3kj3heajkdblqjhb1jhsda -> email:password
    const token = this.authService.extractTokenFromHeader(rawToken, false);
    const  credential = this.authService.decodeBasicToken(token);
    return this.authService.loginWithEmail({
      email: credential.email,
      password: credential.password,
    });
  }

  @Post('register/email')
  postRegisterEmail(
    @Body('nickname') nickname: string,
    @Body('email') email: string,
    // Pipe에서 걸리면 아래의 로직은 실행되지 않는다. + 생성자가 있기 때문에 new를 띄운다.
    @Body('password', new MaxLengthPipe(8, '비밀번호'), new MinLengthPipe(3, '비밀번호')) password: string, 
  ) {
    return this.authService.registerWithEmail({
      email,
      nickname,
      password,
    })
  }
}
