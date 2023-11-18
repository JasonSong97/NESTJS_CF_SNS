import { Body, Controller, Post, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('token/refresh')
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
    @Body('password') password: string,
  ) {
    return this.authService.registerWithEmail({
      email,
      nickname,
      password,
    })
  }
}
