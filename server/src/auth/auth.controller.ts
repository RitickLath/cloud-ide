import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('check-username')
  async checkUsername(@Query('username') username: string) {
    return this.authService.checkUsernameAvailability(username);
  }

  @Post('register')
  async register(@Body() body: RegisterAuthDto) {
    return this.authService.register(body);
  }

  @Get('verify-email')
  async verifyEmail(
    @Query('token') token: string,
    @Query('email') email: string,
  ) {
    return this.authService.verifyEmail(token, email);
  }

  @Post('login')
  async login(@Body() body: RegisterAuthDto) {
    return this.authService.login(body);
  }

  @Post('logout')
  async logout() {
    return this.authService.logout();
  }

  @Get('me')
  async me() {
    return this.authService.me();
  }
}
