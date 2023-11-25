import { Body, Controller, Post, Headers, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MaxLengthPipe, MinLengthPipe, PasswordPipe } from './pipe/password.pipe';
import { BasicTokenGuard } from './guard/basic-token.guard';
import { RefreshTokenGuard } from './guard/bearer-token.guard';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard) // access token을 refresh 할때도 refresh token이 필요
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
  @UseGuards(RefreshTokenGuard) // access token을 refresh 할때도 refresh token이 필요
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
  @UseGuards(BasicTokenGuard) // 로그인시에만 Basic token guard
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
    @Body() body: RegisterUserDto, 
  ) {
    return this.authService.registerWithEmail(body);
  }
}
