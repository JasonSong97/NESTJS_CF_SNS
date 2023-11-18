import { Body, Controller, Post, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('login/email')
  loginEmail(
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
  registerEmail(
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
